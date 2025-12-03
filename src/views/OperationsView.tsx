import { useState, useCallback, useRef } from "react";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { Header } from "@/components/Header";
import { VoiceButton } from "@/components/VoiceButton";
import { Badge } from "@/components/ui/badge";
import { useTickets, Ticket } from "@/context/TicketContext";
import { cn } from "@/lib/utils";
import { AudioRecorder } from "@/lib/audioRecorder";
import { transcribeAudio, processIssueReport } from "@/lib/openai";
import { toast } from "sonner";

interface OperationsViewProps {
  onBack: () => void;
}

type VoiceState = "idle" | "listening" | "processing" | "success" | "error";

export function OperationsView({ onBack }: OperationsViewProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [recentReports, setRecentReports] = useState<Ticket[]>([]);
  const [lastCreatedTicket, setLastCreatedTicket] = useState<Ticket | null>(
    null
  );
  const [processingStep, setProcessingStep] = useState<string>("");
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const { addTicket } = useTickets();

  const handleVoiceStart = useCallback(async () => {
    try {
      if (!audioRecorderRef.current) {
        audioRecorderRef.current = new AudioRecorder();
      }
      await audioRecorderRef.current.startRecording();
      setVoiceState("listening");
    } catch (error) {
      console.error("Failed to start recording:", error);
      setVoiceState("error");
      setTimeout(() => {
        toast.error("Failed to access microphone");
        setVoiceState("idle");
      }, 0);
    }
  }, []);

  const handleVoiceEnd = useCallback(async () => {
    if (voiceState !== "listening" || !audioRecorderRef.current) return;

    setVoiceState("processing");
    setProcessingStep("Stopping recording...");

    try {
      const audioBlob = await audioRecorderRef.current.stopRecording();
      console.log("[Voice Debug] Audio blob:", {
        size: audioBlob.size,
        type: audioBlob.type,
        sizeInKB: (audioBlob.size / 1024).toFixed(2) + " KB",
      });

      setProcessingStep("Transcribing audio...");
      const transcription = await transcribeAudio(audioBlob);
      console.log("[Voice Debug] Transcription:", transcription);

      if (!transcription || transcription.trim().length === 0) {
        throw new Error("No speech detected");
      }

      setProcessingStep("Analyzing issue...");
      const result = await processIssueReport(transcription);
      console.log("[Voice Debug] AI Analysis Result:", result);

      setProcessingStep("Creating ticket...");
      const newTicket = addTicket({
        machineName: result.machineName,
        zone: result.zone,
        issueSummary: result.issueSummary,
        priority: result.priority,
        status: "open",
        aiActionPlan: result.actionPlan,
        reportedBy: "Current User",
      });

      setLastCreatedTicket(newTicket);
      setRecentReports((prev) => [newTicket, ...prev].slice(0, 5));
      setVoiceState("success");
      setProcessingStep("");

      setTimeout(() => {
        setVoiceState("idle");
        setLastCreatedTicket(null);
      }, 4000);
    } catch (error) {
      console.error("Error processing voice input:", error);
      setVoiceState("error");
      setProcessingStep("");
      setTimeout(() => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to process voice input"
        );
        setVoiceState("idle");
      }, 0);
    }
  }, [voiceState, addTicket]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title="Operations"
        subtitle="Voice Issue Reporter"
        onBack={onBack}
      />

      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
        {/* Voice Button Section */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-md w-full">
          {voiceState === "idle" && (
            <>
              <p className="text-muted-foreground text-center text-lg">
                Hold to Report Issue
              </p>
              <VoiceButton
                isListening={false}
                onMouseDown={handleVoiceStart}
                onMouseUp={handleVoiceEnd}
              />
              <p className="text-sm text-muted-foreground">
                Hold for at least 0.5 seconds and describe the issue
              </p>
            </>
          )}

          {voiceState === "listening" && (
            <>
              <div className="flex items-center gap-2 text-accent">
                <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                <span className="text-xl font-mono">Listening...</span>
              </div>
              <VoiceButton
                isListening={true}
                onMouseDown={handleVoiceStart}
                onMouseUp={handleVoiceEnd}
              />
              <p className="text-sm text-muted-foreground animate-pulse">
                Release when finished
              </p>
            </>
          )}

          {voiceState === "processing" && (
            <div className="flex flex-col items-center gap-6 animate-fade-up">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <div className="text-center">
                <p className="text-xl font-mono text-foreground mb-2">
                  Processing Voice Input...
                </p>
                <p className="text-sm text-muted-foreground">
                  {processingStep}
                </p>
              </div>
            </div>
          )}

          {voiceState === "error" && (
            <div className="flex flex-col items-center gap-6 animate-fade-up">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <div className="text-center">
                <p className="text-xl font-mono text-destructive mb-2">
                  Processing Failed
                </p>
                <p className="text-sm text-muted-foreground">
                  Please try again
                </p>
              </div>
            </div>
          )}

          {voiceState === "success" && lastCreatedTicket && (
            <div className="w-full bg-card border border-success/50 rounded-lg p-6 animate-fade-up">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="font-mono font-bold text-success">
                    Ticket Created!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    #{lastCreatedTicket.ticketNumber}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={lastCreatedTicket.priority}>
                    {lastCreatedTicket.priority}
                  </Badge>
                  <span className="font-semibold">
                    {lastCreatedTicket.machineName}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {lastCreatedTicket.issueSummary}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Reports */}
        {recentReports.length > 0 && voiceState === "idle" && (
          <div className="w-full max-w-md mt-8">
            <h2 className="text-sm font-mono text-muted-foreground mb-4 uppercase tracking-wider">
              My Recent Reports
            </h2>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={cn(
                        "w-5 h-5",
                        report.priority === "critical" && "text-destructive",
                        report.priority === "high" && "text-warning",
                        report.priority === "low" && "text-primary"
                      )}
                    />
                    <div>
                      <p className="font-medium text-sm">
                        {report.machineName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        #{report.ticketNumber}
                      </p>
                    </div>
                  </div>
                  <Badge variant={report.priority} className="text-xs">
                    {report.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

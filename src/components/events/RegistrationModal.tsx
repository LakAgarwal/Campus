import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api, getCurrentUserId } from "@/api/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import QRCode from 'qrcode';

interface Question {
  question_id: number;
  question: string;
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  eventName: string;
  eventType: string;
  questions: Question[];
  paymentLink?: string;
}

const registrationSchema = z.object({
  answers: z.record(z.string()),
  payment_proof: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

export const RegistrationModal = ({
  isOpen,
  onClose,
  eventId,
  eventName,
  eventType,
  questions,
  paymentLink,
}: RegistrationModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug questions data
  React.useEffect(() => {
    console.log("RegistrationModal received questions:", questions);
  }, [questions]);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      answers: questions.reduce((acc, q) => {
        console.log("Processing question:", q);
        return {
          ...acc,
          [q.question_id]: "",
        };
      }, {}),
      payment_proof: "",
    },
  });

  // Reset form when modal opens/closes or questions change
  React.useEffect(() => {
    if (isOpen) {
      console.log("Resetting form with questions:", questions);
      form.reset({
        answers: questions.reduce((acc, q) => {
          console.log("Processing question for reset:", q);
          return {
            ...acc,
            [q.question_id]: "",
          };
        }, {}),
        payment_proof: "",
      });
    }
  }, [isOpen, questions, form]);
  const generateQRCodeBase64 = async (data: string): Promise<string> => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(data);
      return qrCodeDataURL; // Returns data:image/png;base64,...
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  };

  const onSubmit = async (data: RegistrationFormValues) => {
    try {
      setIsSubmitting(true);
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("Please sign in to register for events");
      }

      const eventData = await api.get<{ clubId?: number }>(`/events/${eventId}`);
      const clubId = eventData?.clubId ?? 0;
      const profileData = await api.get<{ full_name?: string; fullName?: string }>(`/profiles/${userId}`);
      const fullname = profileData?.full_name ?? (profileData as { fullName?: string })?.fullName ?? "";

      const qrData = {
        club_id: clubId,
        event_id: eventId,
        user_id: userId,
        fullname,
        is_used: false,
      };
      const qrCodeBase64 = await generateQRCodeBase64(JSON.stringify(qrData));

      await api.post(`/events/${eventId}/register`, {
        event_type: eventType,
        payment_proof: data.payment_proof || null,
        qr_code: qrCodeBase64,
        answers: data.answers,
      });

      toast({
        title: "Success!",
        description: "You have successfully registered for the event.",
      });
      onClose();
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register for the event.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-sm bg-white/95">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Register for {eventName}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Are you sure you want to register for this event?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    {questions.map((question) => {
      if (!question?.question_id) {
        console.error("Skipping question with missing ID:", question);
        return null; // Skip rendering invalid questions
      }

      return (
        <FormField
          key={`question-${question.question_id}`} // Ensure unique key
          control={form.control}
          name={`answers.${question.question_id}`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{question.question}</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter your answer"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    })}

    {eventType === "paid" && paymentLink && (
      <>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Please make the payment using this link:{" "}
            <a
              href={paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              {paymentLink}
            </a>
          </p>
        </div>

        <FormField
          control={form.control}
          name="payment_proof"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Proof (Transaction ID or Screenshot URL)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Enter transaction ID or screenshot URL"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    )}

    <div className="flex justify-end gap-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={isSubmitting}
        className="px-6 py-2 hover:bg-gray-100 transition-colors duration-200"
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="px-6 py-2 bg-primary hover:bg-primary/90 transition-all duration-200 hover:shadow-md"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Confirm Registration
      </Button>
    </div>
  </form>
</Form>

      </DialogContent>
    </Dialog>
  );
}; 
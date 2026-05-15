"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Please provide a valid 10-digit Indian mobile number."),
  registrationNumber: z.string().min(1, "Registration number is required."),
  schoolCollegeName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function RegisterDialog({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  isVitStudent,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  isVitStudent: boolean;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobileNumber: "",
      registrationNumber: "",
      schoolCollegeName: isVitStudent ? "Vellore Institute Of Technology" : "",
    },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          ...values,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      toast({
        title: "Registration Successful",
        description: `You are now registered for ${eventTitle}`,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black/90 border-white/10 backdrop-blur-xl text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tighter text-[#ffafd5]">EVENT REGISTRATION</DialogTitle>
          <DialogDescription className="text-arcade-muted">
            Enter your details to register for <span className="text-white font-bold">{eventTitle}</span>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} className="bg-white/5 border-white/10 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isVitStudent ? "VIT Registration Number" : "Registration Number"}</FormLabel>
                  <FormControl>
                    <Input placeholder="22BCE1234" {...field} className="bg-white/5 border-white/10 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isVitStudent && (
              <FormField
                control={form.control}
                name="schoolCollegeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School/College Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Institution" {...field} className="bg-white/5 border-white/10 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full arcade-btn h-12 font-black tracking-widest"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "CONFIRM REGISTRATION"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

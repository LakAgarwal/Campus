import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getApiBaseUrl } from "@/lib/api";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  club_code: z.string().length(5, {
    message: "Club code must be exactly 5 characters",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ClubLoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      club_code: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const base = getApiBaseUrl();
      const res = await fetch(`${base}/club-auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clubCode: values.club_code.trim().toUpperCase(),
          password: values.password,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        form.setError("club_code", { type: "manual", message: "Invalid club code or password." });
        setError("Invalid club code or password.");
        return;
      }
      const clubInfo = data.clubs || {};
      sessionStorage.setItem("club_id", String(data.club_id));
      sessionStorage.setItem("club_name", clubInfo.name || "");
      sessionStorage.setItem("club_category", clubInfo.category || "");
      toast({
        title: "Login Successful",
        description: `Welcome to ${clubInfo.name || "Club"} dashboard!`,
      });
      navigate("/club/dashboard");
    } catch {
      toast({
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      setError("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-md">
      <Card className="w-full shadow-lg">
        <CardHeader className="space-y-1 bg-primary/5 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center">Club Login</CardTitle>
          <CardDescription className="text-center">
            Access your club's management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="club_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter 5-digit club code" 
                        {...field} 
                        maxLength={5}
                        className="font-mono tracking-wider text-center uppercase"
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <div className="text-xs text-muted-foreground mt-1">
                      Enter the 5-character club code (letters and numbers)
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter club password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => navigate('/homepage')}
                  className="w-full"
                >
                  Back to Homepage
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Button 
            variant="link" 
            onClick={() => navigate('/club/create')}
            className="text-sm"
          >
            Don't have a club yet? Create one
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClubLoginForm;

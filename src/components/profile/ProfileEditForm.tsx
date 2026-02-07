
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
<<<<<<< HEAD
import { api, getAuthToken, getCurrentUserId } from "@/api/client";
=======
import { getStoredUserId } from "@/lib/api";
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
import { toast } from "sonner";
import { Profile, bloodGroupOptions, branchOptions, yearOfStudyOptions } from "@/types/profileTypes";
import { Checkbox } from "@/components/ui/checkbox";

const profileFormSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  roll_number: z.string().min(2, "Roll number is required"),
  year_of_study: z.coerce.number(),
  branch: z.string(),
  blood_group: z.string(),
  bio: z.string().optional(),
  contact_info: z.string().optional(),
  social_media_links: z.string().optional(),
  skills: z.string().optional(),
  projects: z.string().optional(),
  volunteering_exp: z.string().optional(),
  profile_picture_url: z.string().optional(),
  preferences: z.array(z.string()).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Define available preferences
const availablePreferences = [
  'Technical', 'Cultural', 'Music', 'Dance', 'Arts', 'Finance', 
  'Coding', 'Web Development', 'Sports', 'Entrepreneurship', 
  'Environment', 'Health & Wellness', 'Gaming', 'Literature'
];

interface ProfileEditFormProps {
  profile: Profile | null;
  optionalData: any;
  preferences: string[];
  onCancel: () => void;
  onSave: (updatedProfile: Profile, updatedOptional: any, updatedPreferences: string[]) => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  profile,
  optionalData,
  preferences,
  onCancel,
  onSave,
}) => {
  if (!profile) return null;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile.full_name,
      roll_number: profile.roll_number,
      year_of_study: profile.year_of_study,
      branch: profile.branch,
      blood_group: profile.blood_group,
      bio: optionalData?.bio || "",
      contact_info: optionalData?.contact_info || "",
      social_media_links: optionalData?.social_media_links || "",
      skills: optionalData?.skills || "",
      projects: optionalData?.projects || "",
      volunteering_exp: optionalData?.volunteering_exp || "",
      profile_picture_url: optionalData?.profile_picture_url || "",
      preferences: preferences || [],
    },
  });

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
<<<<<<< HEAD
      const userId = getCurrentUserId();
=======
      const userId = getStoredUserId();
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
      if (!userId) {
        toast.error("Authentication error. Please sign in again.");
        return;
      }
<<<<<<< HEAD

      // Update profile
      const updatedProfile = await api.patch<Profile>(`/profiles/${userId}`, {
=======
      const updatedProfile: Profile = {
        ...profile,
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
        full_name: data.full_name,
        roll_number: data.roll_number,
        year_of_study: data.year_of_study,
        branch: data.branch,
        blood_group: data.blood_group,
<<<<<<< HEAD
      });

      // Upsert optional profile data
      const optionalPayload = {
        profileId: profile.profile_id,
        bio: data.bio,
        contactInfo: data.contact_info,
        socialMediaLinks: data.social_media_links,
        skills: data.skills,
        projects: data.projects,
        volunteeringExp: data.volunteering_exp,
        profilePictureUrl: data.profile_picture_url,
      };
      const optionalResult = await api.put<unknown>(`/profiles/${userId}/optional`, optionalPayload);

      // Replace preferences: get existing to delete, then add new
      const existingPrefs = await api.get<{ id: number }[]>(`/profiles/${userId}/preferences`);
      for (const p of existingPrefs || []) {
        await api.delete(`/profiles/${userId}/preferences/${p.id}`);
      }
      for (const pref of data.preferences || []) {
        await api.post(`/profiles/${userId}/preferences`, { preference: pref });
      }

      toast.success("Profile updated successfully!");
      onSave(updatedProfile, optionalResult, data.preferences || []);
    } catch (error) {
      console.error("Error updating profile:", error);
=======
      };
      const optionalResult = {
        ...optionalData,
        bio: data.bio,
        contact_info: data.contact_info,
        social_media_links: data.social_media_links,
        skills: data.skills,
        projects: data.projects,
        volunteering_exp: data.volunteering_exp,
        profile_picture_url: data.profile_picture_url,
      };
      toast.success("Profile updated successfully!");
      onSave(updatedProfile, optionalResult, data.preferences || []);
    } catch {
>>>>>>> 0ac01baa4c622dfc7d74ff1260d588d67ffd0325
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-6">
          {/* Required Fields Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Required Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roll_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roll Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {branchOptions.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year_of_study"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Study</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {yearOfStudyOptions.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              Year {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="blood_group"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bloodGroupOptions.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-4" />

              <div>
                <FormLabel className="block mb-2">Interests</FormLabel>
                <FormDescription className="mb-2">
                  Select your interests to discover relevant events
                </FormDescription>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {availablePreferences.map((preference) => (
                    <FormField
                      key={preference}
                      control={form.control}
                      name="preferences"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(preference)}
                              onCheckedChange={(checked) => {
                                const currentValues = field.value || [];
                                return checked
                                  ? field.onChange([...currentValues, preference])
                                  : field.onChange(
                                      currentValues.filter((value) => value !== preference)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            {preference}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optional Fields Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Optional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="profile_picture_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/avatar.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a URL to your profile picture
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about yourself" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact_info"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number or alternate email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="social_media_links"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Media Links</FormLabel>
                      <FormControl>
                        <Input placeholder="LinkedIn, GitHub, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Input placeholder="Separate skills with commas" {...field} />
                    </FormControl>
                    <FormDescription>
                      E.g., Web Development, Leadership, Marketing
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="projects"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Projects</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Share details about your projects" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="volunteering_exp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volunteering Experience</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your volunteering experiences"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default ProfileEditForm;

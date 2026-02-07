import { api } from "@/api/client";
import { groq } from "@/integrations/groqClient";

interface AlertRegisteredEvent {
  event_name: string;
  datetime: string;
}
interface AlertBookmarkedEvent {
  event_name: string;
  registration_deadline: string;
}
interface AlertNewsletter {
  heading: string;
  content: string;
}
interface AlertNotification {
  title: string;
  content: string;
}

async function processAndInsertAIAlerts(userId: string, aiResponseJson: string) {
  const alerts = JSON.parse(aiResponseJson);
  if (!Array.isArray(alerts)) throw new Error("AI response is not an array");
  for (const alert of alerts) {
    if (!alert.heading || !alert.content || !alert.time) throw new Error("AI-generated alert missing required fields");
  }
  const alertsToInsert = alerts.map((alert: { heading: string; content: string; time: string }) => ({
    user_id: userId,
    heading: alert.heading,
    content: alert.content,
    time: alert.time,
  }));
  try {
    await api.post('/alerts', alertsToInsert);
  } catch (e) {
    console.error("Failed to insert alerts:", e);
  }
}

export const handleAIAlert = async (userId: string, _timestamp: Date) => {
  try {
    const [registrations, newsletters, bookmarkedEvents, notifications] = await Promise.all([
      api.get<{ event_id: number; events?: { name: string; datetime: string } }[]>('/events/my-registrations').catch(() => []),
      api.get<{ heading: string; content: string }[]>('/newsletters').catch(() => []),
      api.get<{ event_id: number; events?: { name: string; registration_deadline: string } }[]>('/bookmarked-events?userId=' + userId).catch(() => []),
      api.get<{ title: string; content: string }[]>('/notifications?userId=' + userId).catch(() => []),
    ]);
    const registeredList = Array.isArray(registrations) ? registrations : [];
    const alertRegisteredEvents: AlertRegisteredEvent[] = registeredList
      .filter((e): e is { event_id: number; events: { name: string; datetime: string } } => e.events != null)
      .map((e) => ({ event_name: e.events.name, datetime: e.events.datetime }));
    const alertBookmarkedEvents: AlertBookmarkedEvent[] = (Array.isArray(bookmarkedEvents) ? bookmarkedEvents : [])
      .filter((e): e is { events: { name: string; registration_deadline: string } } => e.events != null)
      .map((e) => ({ event_name: e.events.name, registration_deadline: e.events.registration_deadline }));
    const alertNewsletters: AlertNewsletter[] = Array.isArray(newsletters) ? newsletters : [];
    const alertNotifications: AlertNotification[] = Array.isArray(notifications) ? notifications : [];

    const alertData = {
      registeredEvents: alertRegisteredEvents,
      bookmarkedEvents: alertBookmarkedEvents,
      newsletters: alertNewsletters,
      notifications: alertNotifications,
    };
    const currentTime = new Date().toISOString();
    const aiPrompt = `
You are an AI assistant tasked with transforming user data into a standardized alert format. The user data includes registered events, bookmarked events, newsletters, and notifications. Your job is to create a list of alerts, each with 'heading', 'content', and 'time' fields, based on the following rules. The 'content' field must not exceed 14-15 words.

Current time: ${currentTime}
User Data:
${JSON.stringify(alertData, null, 2)}

Instructions:
**For each registered event in "registeredEvents":** Set 'heading' to the event's "event_name". Set 'content' to saying that the event is starting in [time difference]. Set 'time' to a human-readable time difference string.
**For each bookmarked event in "bookmarkedEvents":** Set 'heading' to the event's "event_name". Set 'content' to "Registrations closing in [time difference], complete now!". Set 'time' to a human-readable time difference string.
**For each newsletter in "newsletters":** Set 'heading' to the newsletter's "heading". Set 'content' to the newsletter's "content" (truncate to 14 words if needed). Set 'time' to "Now".
**For each notification in "notifications":** Set 'heading' to the notification's "title". Set 'content' to the notification's "content". Set 'time' to "Now".
Output a JSON array only. No other text.
`;
    const aiResponse = await groq.chat.completions.create({
      model: "gemma2-9b-it",
      messages: [{ role: "user", content: aiPrompt }],
      temperature: 0.7,
    });
    const alertsJson = aiResponse.choices[0]?.message?.content ?? "[]";
    await processAndInsertAIAlerts(userId, alertsJson);
  } catch (error) {
    console.error('Error in handleAIAlert:', error);
    throw error;
  }
};

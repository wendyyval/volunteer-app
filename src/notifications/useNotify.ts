import { useNotifications } from "./NotificationProvider";
import { makeNotice, type NoticeTopic, type NoticeKind } from "./notify";

export function useNotify(){
    const {push} = useNotifications();

    return{
        send: (kind: NoticeKind, topic: NoticeTopic, title:string, message ?: string) =>
            push(makeNotice({kind, topic, title, message})),


        eventAssigned: (eventName: string, when: string) =>
            push(makeNotice({
                kind: "success", 
                topic:"event_assignment", 
                title:`Assigned: ${eventName}`, 
                message: `Scheduled for ${when}`
            })),

        eventUpdated: (eventName: string) =>
            push(makeNotice({
                kind: "info", 
                topic: "event_update", 
                title: `Event updated`, 
                message: eventName
            })),
            reminder: (eventName :string, when: string) =>
                push(makeNotice({
                    kind: "warning", 
                    topic: "reminder", 
                    title: `Reminder: ${eventName}`, 
                    message: when
                })),
    };

}
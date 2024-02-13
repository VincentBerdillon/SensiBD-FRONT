export type Discussion = {
  receiver_id: number;
  post_id: number;
  post_title: string;
  sender_id: number;
  sender_pseudonym: string;
  receiver_pseudonym: string;
  last_message_time: Date;
};

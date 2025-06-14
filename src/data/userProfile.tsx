export interface UserProfile {
  playerName: string;
  partnerName: string;
  pronouns: {
    subject: string; // he/she/they
    object: string;  // him/her/them
    possessive: string; // his/her/their
  };
}

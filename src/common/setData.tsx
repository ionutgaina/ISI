import { ref, set } from "firebase/database";
import { auth, db } from "./config/firebase";

export const sendDataToFirebase = async () => {
  try {
    const user = auth.currentUser;


    console.log ("User: ", user);
    if (user) {
    console.log("User is logged in!");
      const dataRef = ref(db, `data/${user.uid}`);
      await set(dataRef, {
        name: user.displayName,
        email: user.email,
        lastLogin: new Date().toISOString(),
      });

      console.log("Data sent successfully!");
    } else {
      console.error("User is not logged in!");
    }
  } catch (error) {
    console.error("Error sending data:", error);
  }
};

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const getReferal = async (user, setReferralAvailable, setLoading) => {
    if (!user?.uid) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
        const data = snap.data();
        
        setReferralAvailable(data?.referredDevices ? data.referredDevices : 0);
    }
    setLoading(false);
};
export default getReferal;
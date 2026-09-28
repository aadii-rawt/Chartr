
const subscriptionExpireAt = (planName: string) => {
    const startAt = new Date();
    const expireDate = new Date(startAt);
    expireDate.setHours(0, 0, 0, 0);

    if (planName === "premium") {
        expireDate.setMonth(expireDate.getMonth() + 2);
    } else {
        expireDate.setMonth(expireDate.getMonth() + 1);
    }

    return expireDate;
};

export default subscriptionExpireAt


export const getDiscountPirce = (actualPirce, referralAvailable) => {
    let discountPrice;
    if (actualPirce < 300) {
        return Math.round(actualPirce - (referralAvailable * 50))
    } else {
        return Math.round(actualPirce - (referralAvailable * 150))
    }
}


// import React, { createContext, useContext, useState } from 'react';

// const ReservationContext = createContext();

// export const useReservation = () => useContext(ReservationContext);

// export const ReservationProvider = ({ children }) => {
//     const [PaymentData, setPaymentData] = useState({
//         payment_uid: "",
//         merchant_uid: "",
//         itemname: "",
//         amount: "",
//         area: "",
//         buyer_name: "",
//         buyer_tel: "",
//         start_date: "",
//         seating: "",


//     });

//     return (
//         <ReservationContext.Provider value={{ PaymentData, setPaymentData }}>
//             {children}
//         </ReservationContext.Provider>
//     );
// };
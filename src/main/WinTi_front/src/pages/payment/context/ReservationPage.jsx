// import { useEffect } from 'react';
// import { useReservation } from './ReservationContext';
// import { nanoid } from 'nanoid';

// const ReservationPage = () => {
//     const { setReservationDetails } = useReservation();
//     const order_uid = nanoid();
//     useEffect(() => {
//         // Simulate fetching data from a database
//         const fetchData = async () => {
//             // Example static data, replace with actual API call
//             setReservationDetails({
//                 orderUid: nanoid,
//                 itemName: 'card',
//                 paymentPrice: 10,
//                 buyerEmail: 'yhak08@naver.com',
//                 buyerName: 'hello',
//                 buyerAddress: '123 Main St'
//             });
//         };

//         fetchData();
//     }, [setReservationDetails]);

//     return <div>Reservation details have been set.</div>;
// };
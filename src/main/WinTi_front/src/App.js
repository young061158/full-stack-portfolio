import JoinMembership from "./pages/join_membership/Join_Membership.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginMain from "./pages/login/Login_Main.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.jsx";
import JoinMembershipFinish from "./pages/join_membership/Join_Membership_finish";
import FindByID from "./pages/login/Find_by_ID.tsx";
import FindByPW from "./pages/login/Find_by_PW.tsx";
import Home from "./pages/main/Home";
import OAuth from "./axios/oauth/index.tsx";
import SearchPage from "./components/Search/SearchPage.jsx";
import CategoryPage from "./components/category/CategoryPage.jsx";

import JoinMembershipMain from "./pages/join_membership/Join_Membership_main.tsx";
import My_Page_Main from "./pages/my_page/My_Page_Main.tsx";
import Modify_Account from "./pages/my_page/Modify_Account.tsx";
import Modify_End from "./pages/my_page/Modify_End.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import Mobile_ticket from "./pages/my_page/Mobile_ticket.tsx";
import Seller_Registration from "./pages/my_page/Seller_Registration.tsx";
import User_Reservation from "./pages/my_page/User_Reservation.tsx";
import MainBannerUploadStep1 from "./components/Main/upload/MainBannerUploadStep1.jsx";
import MainBannerUploadStep2 from "./components/Main/upload/MainBannerUploadStep2.jsx";
import MainBannerUploadStep3 from "./components/Main/upload/MainBannerUploadStep3.jsx";
import Performance_add from "./pages/perfomance/Performance_add.tsx";
import { ReservationProvider } from "./pages/payment/context/ReservationContext.jsx";
import { ThemeProvider } from "styled-components";
import { ShowDetailsProvider } from "./components/User_Reservation/context/DataContext.js";
import Payments from "./components/User_Reservation/Payments.jsx";
import ConfirmPayment from "./components/User_Reservation/ConfirmPayment.jsx";
import ShowDetailPage from "./components/User_Reservation/showdetail/ShowDetailPage.jsx";
import SeatSelection from "./components/User_Reservation/SeatSelection.jsx";
import SelectPrice from "./components/User_Reservation/SelectPrice.jsx";
import Confirmation from "./components/User_Reservation/Confirmation.jsx";
import Choice_Membership from "./pages/join_membership/Choice_Membership.tsx";
import Sns_Membership from "./pages/join_membership/Sns_Membership.tsx";
import Disable_User from "./pages/my_page/Disable_User.tsx";
import ReservationShow from "./components/User_Reservation/reservation/ReservationShow.jsx";

const theme = {
  gray_1: "#6B7280",
  darkBlack: "#000000",
  red_1: "#FF0000",
  primary_2: "#4F46E5",
  gray_5: "#D1D5DB",
  yellow_2: "#FBBF24",
  primary_3: "#6366F1",
  br_2: "#D97706",
};
function App() {
  return (
    <div className="App">
      <Router>
        <ThemeProvider theme={theme}>
          <ScrollToTop />
          <Header />
          <Routes>
            {/* 메인 페이지 */}
            <Route exact path="/" element={<Home />} />

            {/* 검색 및 카테고리별 페이지 */}
            <Route path="/search/:query" element={<SearchPage />} />
            <Route
              path="/category/:categoryName"
              element={<CategoryPage />}
            />

            {/* 로그인 및 회원가입 */}
            <Route exact path="/Login" element={<LoginMain />} />
            <Route
              exact
              path="/user/oauth-response/:token/:expirationTime"
              element={<OAuth />}
            ></Route>
            <Route
              exact
              path="/Join_Member"
              element={<JoinMembership />}
            ></Route>
            <Route
              exact
              path="/Join_Membership_main"
              element={<JoinMembershipMain />}
            ></Route>
            <Route
              exact
              path="/Join_Membership_finish"
              element={<JoinMembershipFinish />}
            />
            <Route
              exact
              path="/Sns_Membership"
              element={<Sns_Membership />}
            />
            <Route exact path="/Find_by_ID" element={<FindByID />} />
            <Route exact path="/Find_by_PW" element={<FindByPW />} />
            <Route
              exact
              path="/Choice_Membership"
              element={<Choice_Membership />}
            />

            {/* My_Page 관련 라우트 */}
            <Route exact path="/My_Page" element={<My_Page_Main />} />
            <Route exact path="/My_Page/Modify_Account" element={<Modify_Account />} />
            <Route exact path="/My_Page/Modify_End" element={<Modify_End />} />
            <Route exact path="/My_Page/Mobile_ticket" element={<Mobile_ticket />} />
            <Route exact path="/My_Page/Seller_Registration" element={<Seller_Registration />} />
            <Route exact path="/My_Page/User_Reservation" element={<User_Reservation />} />
            <Route exact path="/My_page/User_Reservation/:reservationShowId" element={<ReservationShow />} />

            {/* 공연 추가 관련 라우트 */}
            <Route exact path="/banner/upload" element={<MainBannerUploadStep1 />} />
            <Route exact path="/banner/upload/step2" element={<MainBannerUploadStep2 />} />
            <Route exact path="/banner/upload/step3" element={<MainBannerUploadStep3 />} />

            {/* Performance_add 관련 라우트 */}
            <Route exact path="/performance/add" element={<Performance_add />} />

            <Route
              exact
              path="/performance/modify/:modifyShowId"
              element={<Performance_add />}
            />

            {/* 탈퇴하기 */}
            <Route
              exact
              path="/My_Page/Disable_User"
              element={<Disable_User />}
            />

            {/* 공연 상세보기 */}
            <Route
              exact
              path="/user/oauth-response/:token/:expirationTime"
              element={<OAuth />}
            ></Route>

            {/* 상세페이지/결제페이지 */}
            <Route
              path="/performance/:id"
              element={
                <ShowDetailPage />
              }
            ></Route>
            <Route
              path="/seatSelection"
              element={
                <SeatSelection />
              }
            ></Route>
            <Route
              path="/selectPrice"
              element={
                <SelectPrice />
              }
            ></Route>
            <Route
              path="/payments"
              element={
                <Payments />
              }
            ></Route>
            <Route
              path="/confirmation"
              element={
                <Confirmation />
              }
            ></Route>
            <Route
              path="/confirmPayment"
              element={
                <ConfirmPayment />
              }
            ></Route>
          </Routes>
          <Footer />
        </ThemeProvider>
      </Router>

    </div>
  );
}

export default App;

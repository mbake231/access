import React from "react";

import CmtVerticalLayout from "../../../../../@coremat/CmtLayouts/Vertical";
import CmtHeader from "../../../../../@coremat/CmtLayouts/Vertical/Header";
import Header from "../../partials/Header";
import CmtSidebar from "../../../../../@coremat/CmtLayouts/Vertical/Sidebar";
import SidebarHeader from "../../partials/SidebarHeader";
import SideBar from "../../partials/SideBar";
import CmtContent from "../../../../../@coremat/CmtLayouts/Vertical/Content";
import ContentLoader from "../../../ContentLoader";
import CmtFooter from "../../../../../@coremat/CmtLayouts/Vertical/Footer";
import Footer from "../../partials/Footer";
import defaultContext from "../../../contextProvider/AppContextProvider/defaultContext";

const layoutOptions = {
  headerType: defaultContext.headerType,
  footerType: "fixed",
  
  showTourOpt: true,
  showFooterOpt: true,

  layoutStyle: defaultContext.layoutType,
 
 
};

const VerticalDefault = ({children}) => {
  return (
    <CmtVerticalLayout
      className="verticalDefaultLayout"
      layoutOptions={layoutOptions}
      header={
        <CmtHeader>
          <Header />
        </CmtHeader>
      }
      
      footer={
        <CmtFooter>
          <Footer />
        </CmtFooter>
      }
    >
      <CmtContent>
        {children}
        <ContentLoader />
      </CmtContent>
    </CmtVerticalLayout>
  );
};

export default VerticalDefault;

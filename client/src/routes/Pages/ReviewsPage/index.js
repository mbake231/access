import React, {useEffect, useState} from "react";
import GridContainer from "../../../@jumbo/components/GridContainer";
import PageContainer from "../../../@jumbo/components/PageComponents/layouts/PageContainer";
import Grid from "@material-ui/core/Grid";
import RecentReviewsTable from "@jumbo/components/RecentReviewsTable";
import MyReviewsTable from "@jumbo/components/MyReviewsTable";

const ReviewsPage = () => {
  return (
    <PageContainer>
      <GridContainer>
        <Grid item xs={12}>
          <div style={{marginTop: 24}}>
            <h3>Recent reviews site wide</h3>
          </div>
          <RecentReviewsTable />
          <div style={{marginTop: 24}}>
            <h3>My reviews</h3>
          </div>
          <MyReviewsTable />
        </Grid>
      </GridContainer>
    </PageContainer>
  );
};

export default ReviewsPage;

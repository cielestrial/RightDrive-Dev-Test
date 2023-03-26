import { Pagination } from "@mui/material";
import { useSelector } from "react-redux";
import { pageActions } from "../utils/page";
import { RootState, useAppDispatch } from "../utils/store";

const MyPagination = () => {
  const { index, pageTurnEffect } = useSelector(
    (state: RootState) => state.page
  );
  const dispatch = useAppDispatch();
  return (
    <Pagination
      id="Pagination"
      aria-label="Pagination"
      sx={{ m: "auto", pb: 3, px: 3 }}
      count={10}
      shape="rounded"
      page={index}
      onChange={(event, value) => {
        if (value !== index && pageTurnEffect) {
          dispatch(pageActions.disablePageTurnEffect());
          dispatch(pageActions.setIndex(value));
        }
      }}
    />
  );
};

export default MyPagination;

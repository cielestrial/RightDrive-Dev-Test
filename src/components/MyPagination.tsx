import Pagination from "@mui/material/Pagination";
import { useSelector } from "react-redux";
import { myPagesActions } from "../utils/myPages";
import { RootState, useAppDispatch } from "../utils/store";

const MyPagination = () => {
  const { index, pageTurnEffect } = useSelector(
    (state: RootState) => state.myPages
  );
  const dispatch = useAppDispatch();
  return (
    <Pagination
      id="Pagination"
      aria-label="Pagination"
      sx={{ m: "auto", px: 3, pb: 1.5 }}
      count={10}
      shape="rounded"
      page={index}
      onChange={(event, value) => {
        if (value !== index && pageTurnEffect) {
          dispatch(myPagesActions.disablePageTurnEffect());
          dispatch(myPagesActions.setIndex(value));
        }
      }}
    />
  );
};

export default MyPagination;

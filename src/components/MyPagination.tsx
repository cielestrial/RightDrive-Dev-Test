import { Pagination } from "@mui/material";
import { useSelector } from "react-redux";
import { actions } from "../utils/page";
import { RootState, useAppDispatch } from "../utils/store";

const MyPagination = () => {
  const { index } = useSelector((state: RootState) => state.pageIndex);
  const dispatch = useAppDispatch();
  return (
    <Pagination
      aria-label="Pagination"
      sx={{ m: "auto" }}
      count={10}
      shape="rounded"
      page={index}
      onChange={(event, value) => dispatch(actions.setIndex(value))}
    />
  );
};

export default MyPagination;

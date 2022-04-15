import { Link } from "@remix-run/react";

type paginationProps = {
  page?: number;
  prev: string | null;
  next: string | null;
};
export const Pagination = ({ page = 1, prev, next }: paginationProps) => {
  return (
    <div className="flex justify-center gap-4 py-6">
      {prev && <Link to={prev}>Prev</Link>}

      <div className="text-white border-2 border-white rounded-full px-4 py-2">
        {page}
      </div>
      {next && <Link to={next}>Next</Link>}
    </div>
  );
};

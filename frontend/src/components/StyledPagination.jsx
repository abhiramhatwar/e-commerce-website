import Pagination from "react-bootstrap/Pagination";
import "./StyledPagination.css";

function StyledPagination({ page, setPage, lastPage }) {
  return (
    <Pagination>
      <Pagination.Prev onClick={() => setPage(page - 1)} disabled={page <= 1} />

      {/* First 2 pages */}
      <Pagination.Item key={1} onClick={() => setPage(1)} active={page === 1}>
        {1}
      </Pagination.Item>
      {lastPage >= 2 && (
        <Pagination.Item key={2} onClick={() => setPage(2)} active={page === 2}>
          {2}
        </Pagination.Item>
      )}

      {/* The current page when there are too many pages*/}
      {lastPage > 4 && <Pagination.Ellipsis key='ellipsis' />}
      {lastPage >= 4 && page > 2 && page <= lastPage - 2 && (
        <>
          <Pagination.Item key={page} onClick={() => setPage(page)} active={true}>
            {page}
          </Pagination.Item>
          <Pagination.Ellipsis key='ellipsis' />
        </>
      )}

      {/* Last 2 pages */}
      {lastPage > 3 && (
        <Pagination.Item key={lastPage - 1} onClick={() => setPage(lastPage - 1)} active={page === lastPage - 1}>
          {lastPage - 1}
        </Pagination.Item>
      )}
      {lastPage > 2 && (
        <Pagination.Item key={lastPage} onClick={() => setPage(lastPage)} active={page === lastPage}>
          {lastPage}
        </Pagination.Item>
      )}

      <Pagination.Next onClick={() => setPage(page + 1)} disabled={page >= lastPage} />
    </Pagination>
  );
}

export default StyledPagination;

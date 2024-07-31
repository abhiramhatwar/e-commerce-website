import { useSearchParams } from "react-router-dom";
import StyledHeading from "./StyledHeading";
import { useEffect, useState } from "react";
import axios from "axios";
import StyledPagination from "./StyledPagination";
import StyledLoading from "./StyledLoading";
import noProducts from "../assets/no-product-found.png";
import { Col, Form, Image, Row } from "react-bootstrap";
import Product from "./Product";

function SearchResults() {
  const [searchTerm] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(1);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const limit = 12;
  const sort = -1;

  useEffect(() => {
    setLoading(true);
    // Fetch the filtered product list
    axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/products?page=${page}&limit=${limit}&sort=${sort}&filter=${filter}&search=${searchTerm.get("search")}`
      )
      .then((res) => {
        setProducts(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, filter]);

  // Fetch the total product count
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/count?filter=${filter}&search=${searchTerm.get("search")}`)
      .then((res) => {
        setTotalProducts(res.data.message);
        setPage(1);
      });
  }, [filter]);

  const handleFilters = (e) => {
    setFilter(e.target.value);
    console.log(e.target.value);
  };

  return (
    <>
      <StyledHeading heading='Search Results' />
      <div className='justify-content-center d-flex'>
        {loading ? (
          <StyledLoading anim='grow' size='sm' />
        ) : (
          <div className='d-flex flex-column align-items-center gap-3 w-100'>
            <Row className='justify-content-between w-100'>
              <Col>
                <h3>
                  Searching products for &quot;{searchTerm.get("search")}&quot; {filter && ` in ${filter} category`}
                </h3>
              </Col>
              <Col>
                <Form.Select aria-label='Filters' onChange={handleFilters} value={filter}>
                  <option value=''>Filters</option>
                  <option value='men'>Men</option>
                  <option value='women'>Women</option>
                  <option value='kids'>Kids</option>
                </Form.Select>
              </Col>
            </Row>
            {!totalProducts ? (
              <Image src={noProducts} alt='No Products found' />
            ) : (
              <>
                <Row className='row-gap-3 justify-content-md-start justify-content-center w-100'>
                  {products.map((product) => (
                    <Product product={product} key={product._id} />
                  ))}
                </Row>
                <StyledPagination page={page} setPage={setPage} lastPage={Math.ceil(totalProducts / limit)} />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default SearchResults;

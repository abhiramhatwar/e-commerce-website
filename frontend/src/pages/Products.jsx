import { useEffect, useState } from "react";
import axios from "axios";
import Product from "../components/Product";
import StyledHeading from "../components/StyledHeading";
import { Image, Row } from "react-bootstrap";
import StyledPagination from "../components/StyledPagination";
import StyledLoading from "../components/StyledLoading";
import { useSearchParams } from "react-router-dom";
import noProducts from "../assets/no-product-found.png";

function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 12;
  const sort = -1;
  const [filter] = useSearchParams();

  useEffect(() => {
    setLoading(true);
    // Fetch the filtered product list
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/products?page=${page}&limit=${limit}&sort=${sort}&filter=${filter.get(
          "filter"
        )}`
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
    axios.get(`${import.meta.env.VITE_API_URL}/products/count?filter=${filter.get("filter")}`).then((res) => {
      setTotalProducts(res.data.message);
      setPage(1);
    });
  }, [filter]);

  return (
    <>
      <StyledHeading heading='Products' />
      <div className='justify-content-center d-flex'>
        {loading ? (
          <StyledLoading anim='grow' size='sm' />
        ) : (
          <div className='d-flex flex-column align-items-center gap-3 w-100'>
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

export default Products;

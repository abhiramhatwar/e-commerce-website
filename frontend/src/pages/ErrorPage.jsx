import { Link, useRouteError } from "react-router-dom";
import Header from "../components/Header";

function ErrorPage() {
  const error = useRouteError();

  return (
    <>
      <Header />
      <div className='text-center p-5'>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <h2>
          <i>
            {error.status} {error.statusText || error.message}
          </i>
        </h2>

        <Link to='/' className='link-custom-unstyled text-primary'>
          Go back Home
        </Link>
      </div>
    </>
  );
}

export default ErrorPage;

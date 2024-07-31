import logo from "../assets/logo.png";
function HomeCover() {
  return (
    <div className='d-flex flex-column align-items-center text-center'>
      <div className='m-5 cover-custom'>
        <img className='cover-image-custom' src={logo} alt='TrendBlender logo' height='200px' />
        <h1 className='p-3 fs-3 cover-text-custom'>Blend the trends with our variety in selection of clothing.</h1>
      </div>
    </div>
  );
}
export default HomeCover;

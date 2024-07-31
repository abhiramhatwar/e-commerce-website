function StyledHeading({ heading, custom = " bg-success-subtle" }) {
  return (
    <h2
      className={"text-center mb-4  p-2 text-custom fw-bold rounded-4 shadow text-handwriting-custom w-100 " + custom}
    >
      {heading}
    </h2>
  );
}

export default StyledHeading;

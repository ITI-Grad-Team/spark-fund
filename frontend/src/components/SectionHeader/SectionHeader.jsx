import "./SectionHeader.css";

const SectionHeader = (props) => {
  return (
    <section className="section-header">
      <h2>{props.header}</h2>

      <p>{props.paragraph}</p>
    </section>
  );
};

export default SectionHeader;

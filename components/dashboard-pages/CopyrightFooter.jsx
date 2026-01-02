const CopyrightFooter = () => {
  return (
    <div className="copyright-text">
      <p>
        © {new Date().getFullYear()} Find Cleaner by{" "}
        <a
          href="http://digitalwebsolutions.co.uk/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Digital Web Solutions
        </a>
        . All Right Reserved.
      </p>
    </div>
  );
};

export default CopyrightFooter;

import Container from "./container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="font-body bg-accent-1 border-t border-accent-3">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <div className="flex flex-col lg:flex-row justify-center items-center">
            <a
              href={`https://github.com/clay-coffman/personal-site`}
              className="mx-3 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faCode} /> View source
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

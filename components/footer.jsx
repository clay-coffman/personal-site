import Container from "./container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="font-body text-xs">
      <Container>
        <div className="my-8 flex flex-col lg:flex-row items-center">
          <div className="flex flex-col lg:flex-row justify-center items-center">
            <a
              href={`https://github.com/clay-coffman/personal-site`}
              className="mx-4 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faCode} /> View source (be gentle...)
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

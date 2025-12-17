import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="border-t border-base-300">
      <div className="container mx-auto">
        <footer className="footer sm:footer-horizontal text-base-content p-2 grid-cols-12">
          <aside className="col-span-8">
            <Image
              src="/leads-baton-logo.png"
              alt="LeadsBaton Logo"
              width={92}
              height={72}
            />
            <div className="flex gap-2">
              <a
                href="#"
                className="text-base-content/60 hover:text-base-content transition-colors"
                aria-label="Instagram"
              >
                <i className="ri-instagram-line text-2xl"></i>
              </a>
              <a
                href="#"
                className="text-base-content/60 hover:text-base-content transition-colors"
                aria-label="LinkedIn"
              >
                <i className="ri-linkedin-box-fill text-2xl"></i>
              </a>
              <a
                href="#"
                className="text-base-content/60 hover:text-base-content transition-colors"
                aria-label="X (Twitter)"
              >
                <i className="ri-twitter-x-line text-2xl"></i>
              </a>
            </div>
          </aside>
          <nav className="col-span-2">
            <h6 className="footer-title">Learn more</h6>
            <Link href="/insights" className="link link-hover">
              Insights
            </Link>
            <Link href="/whitepapers" className="link link-hover">
              White Papers
            </Link>
            <Link href="/webinars" className="link link-hover">
              Webinars
            </Link>
          </nav>
          <nav className="col-span-2">
            <h6 className="footer-title">Support</h6>
            <Link href="/contact" className="link link-hover">
              Contact
            </Link>
            <Link href="/support" className="link link-hover">
              Support
            </Link>
            <Link href="/legal" className="link link-hover">
              Legal
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default Footer;

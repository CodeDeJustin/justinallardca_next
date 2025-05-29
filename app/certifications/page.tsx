import { loadHtmlBody } from "../../lib/loadHtml";

const html = loadHtmlBody("certifications.html");

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

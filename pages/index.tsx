import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import mermaid from "mermaid";
import Layout from "../components/Layout";

type Props = {
  code?: string;
  error?: string;
};

const Editor = ({ code, error }: Props) => {
  const mermaidId = `mermaid${uuidv4()}`;
  const [inputCode, setInputCode] = useState(code);
  const [diagram, setDiagram] = useState("");
  
  // TODO: check why addHtmlLabel was not included in the webpack build output for mermaid
  // below is a temp work-around
  if (typeof window !== "undefined") {
    (window as any).addHtmlLabel = require('dagre-d3/lib/label/add-html-label');
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      mermaid.render(mermaidId, inputCode, (html) => setDiagram(html));
    }, 500);

    return () => clearTimeout(timeOutId);
  }, [inputCode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <textarea
        className="form-control
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        value={inputCode}
        onChange={(e) => setInputCode(e.target.value)}
      ></textarea>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: diagram }}></code>
      </pre>
    </div>
  );
};

const EditorPage = () => {
  const code = `graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;`;
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <Editor code={code} />
    </Layout>
  );
};

export default EditorPage;

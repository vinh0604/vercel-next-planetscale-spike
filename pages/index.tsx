import React, { useEffect, useState } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { v4 as uuidv4 } from "uuid";
import mermaid from "mermaid";
import Layout from "../components/Layout";
import { NotesDao } from "../dao/notes_dao";
import { useRouter } from "next/router";

type PageProps = {
  noteId?: string;
  code: string;
  error?: string;
};

type EditorProps = {
  code: string;
  setCode: (string) => void;
  error?: string;
};

interface Note {
  id?: string;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
}

const Editor = ({ code, setCode, error }: EditorProps) => {
  const mermaidId = `mermaid${uuidv4()}`;
  const [diagram, setDiagram] = useState("");
  const [errorMessage, setErrorMessage] = useState(error);

  // TODO: check why addHtmlLabel was not included in the webpack build output for mermaid
  // below is a temp work-around
  if (typeof window !== "undefined") {
    (window as any).addHtmlLabel = require("dagre-d3/lib/label/add-html-label");
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      mermaid.render(mermaidId, code, (html) => setDiagram(html));
    }, 500);

    return () => clearTimeout(timeOutId);
  });

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
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: diagram }}></code>
      </pre>
    </div>
  );
};

const getShareUrl = (noteId: string): string => {
  if (noteId) {
    if (typeof window !== "undefined") {
      return window.location.origin + `/?note=${noteId}`;
    } else {
      return process.env.NEXT_PUBLIC_BASE_URL + `/?note=${noteId}`;
    }
  }
  return '';
}

const EditorPage = ({ noteId: _noteId, code: _code, error }: PageProps) => {
  const [noteCode, setNoteCode] = useState(_code);
  const [noteId, setNoteId] = useState(_noteId);
  const [shareUrl, setShareUrl] = useState(getShareUrl(_noteId));
  const router = useRouter();

  const updateNote = async () => {
    if (noteId) {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: noteCode }),
      };
  
      await fetch(`/api/notes/${noteId}`, options);
    }
  }

  const sharePost = async (event: React.FormEvent) => {
    event.preventDefault();

    if (noteId == undefined) {
      const note = { code: noteCode };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
      };

      const res = await fetch("/api/notes", options);
      if (res.ok) {
        const _noteId = ((await res.json()) as Note).id
        setNoteId(_noteId);
        router.replace({
          query: { ...router.query, note: _noteId }
        });
        setShareUrl(getShareUrl(_noteId));
      }
    }
  };

  const copyToClipboard = () => {
    if (typeof window !== "undefined" && window.isSecureContext && shareUrl) {
      navigator.clipboard.writeText(shareUrl)
    }
  }

  useEffect(() => {
    if (noteId) {
      const timeOutId = setTimeout(async () => {
        await updateNote();
      }, 500);
  
      return () => clearTimeout(timeOutId);
    }
  }, [noteCode]); 

  return (
    <Layout title="MarPad">
      <Editor code={noteCode} setCode={setNoteCode} error={error} />
      <hr className="mt-0.5" />
      <form onSubmit={sharePost} className={(shareUrl ? 'hidden' : 'block')}>
        <button className="inline-block mt-2 px-6 py-2.5 bg-blue-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-500 hover:shadow-lg focus:bg-blue-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out">
          Share
        </button>
      </form>
      <div className={"flex lg:w-1/2 w-full mt-2 " + (shareUrl ? 'visible' : 'invisible')}>
        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300">
          &#128279;
        </span>
        <input type="text" 
                className="rounded-none bg-gray-50 border border-gray-300 text-base font-normal text-gray-500 block flex-1 min-w-0 w-full text-sm p-2.5" 
                readOnly={true} 
                value={shareUrl} />
        <button className="flex-2 px-3 rounded-r-md text-lg text-white bg-sky-400 focus:bg-sky-500 hover:bg-sky-500"
                onClick={copyToClipboard}>
          &#x2398;
        </button>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const noteId = context.query.note as string;

  let note: Note = {
    code: `graph TD;
A-->B;
A-->C;
B-->D;
C-->D;`,
  };
  let error: string | undefined;

  if (noteId) {
    const notesDao = new NotesDao();
    try {
      const noteData = await notesDao.findById(noteId);
      if (noteData != undefined) {
        note = {
          id: noteData.id,
          code: noteData.code
        }
      }
    } catch (err) {
      error = (err as Error).message;
    }
  }

  const _props: PageProps = {
    noteId: note?.id ?? null,
    code: note?.code ?? "",
    error: error ?? null,
  };
  console.log("Server Page Props", _props);
  return { props: _props };
};

export default EditorPage;

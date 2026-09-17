/**
 * Splits an author-list string into segments so a page can bold Shruti's own
 * name in the byline — the same convention her CV itself uses. A plain string
 * replace won't do (we need to keep the rest of the string as-is around the
 * match), so this returns segments for the template to map over.
 */
export interface AuthorSegment {
  text: string;
  highlight: boolean;
}

const HER_NAME = 'Nanivadekar S';

export function splitAuthors(authors: string): AuthorSegment[] {
  return authors
    .split(new RegExp(`(${HER_NAME})`))
    .filter((segment) => segment.length > 0)
    .map((segment) => ({ text: segment, highlight: segment === HER_NAME }));
}

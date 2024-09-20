import * as React from "react";
import ProductAppBar from "../productAppBar/ProductAppBar";
import { getDataFromLocalStorage } from "../../localStorageComp/storage";

// If using TypeScript, add the following snippet to your file as well.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

function PricingPage() {
  const user = getDataFromLocalStorage("user");

  return (
    <>
      <ProductAppBar showMenu={false} />
      <stripe-pricing-table
      // test pricing table and key
        //  pricing-table-id="prctbl_1PF1BOHCiG3NnSwRmalKQozH"
        //  publishable-key="pk_test_51Ox9UXHCiG3NnSwRI2NKdnPkFJ8RhO8zJkAqowpYT39MJksTIPivjL3wfJtb8qjxtFtjfmewNf151KQUqmXLjUlW008JhZHGbK"
        // live - pricing table and key
         pricing-table-id="prctbl_1PG2InHCiG3NnSwRT6Sd4I7c"
        publishable-key="pk_live_51Ox9UXHCiG3NnSwRJUOS1tSXXR8UBhmUb2XLtE7mJoMAm1OppeUU4cBO3Tvow3ptQMbFsItgSHjLZ1d2VDvfp8Ov00DGcQ9p5f"
        
        client-reference-id={user?.id}
        // publishable-key="pk_live_51Ox9UXHCiG3NnSwRJUOS1tSXXR8UBhmUb2XLtE7mJoMAm1OppeUU4cBO3Tvow3ptQMbFsItgSHjLZ1d2VDvfp8Ov00DGcQ9p5f"
        // publishable-key="pk_test_51Ox9UXHCiG3NnSwRI2NKdnPkFJ8RhO8zJkAqowpYT39MJksTIPivjL3wfJtb8qjxtFtjfmewNf151KQUqmXLjUlW008JhZHGbK"
      ></stripe-pricing-table>
    </>
  );
}

export default PricingPage;

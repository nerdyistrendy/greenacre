import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import EnhancedTable from "./EnhancedTable";
import axios from "axios";

const PropertyList = () => {
  const { listId } = useParams();
  const [isLoaded, setIsLoaded] = React.useState(false);
  useEffect(() => {
    axios.get(`/investor_list/${listId}`).then((response) => {
      const results = response.data["message"];
      console.log(listId);
      console.log(typeof results);
      const p_list = eval(results);

      console.log(p_list);
      const pr_list = p_list.map((p) =>
        eval({
          Thumbnail: p.property_type,
          address: p.address,
          type: p.property_type,
          details: p.details,
          price: p.price,
        })
      );
      console.log(pr_list);
      setData(pr_list);
      setIsLoaded(true);
    });
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Thumbnail",
        accessor: "Thumbnail",
      },
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Details",
        accessor: "details",
      },
      {
        Header: "Rent",
        accessor: "rent",
      },
      {
        Header: "Cap Ratio (%)",
        accessor: "capRatio",
      },
      {
        Header: "Note",
        accessor: "note",
      },
    ],
    []
  );
  const [data, setData] = React.useState([]);
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
    if (columnId === "rent") {
      const CAP = ((value * 12) / data[rowIndex]["price"]) * 100;
      setData((old) =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              capRatio: CAP,
            };
          }
          return row;
        })
      );
    }
  };

  return (
    <div>
      <CssBaseline />
      {isLoaded ? (
        <EnhancedTable
          columns={columns}
          data={data}
          setData={setData}
          updateMyData={updateMyData}
          skipPageReset={skipPageReset}
        />
      ) : (
        "Loading"
      )}
    </div>
  );
};

export default PropertyList;

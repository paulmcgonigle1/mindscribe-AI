// import React from "react";
// import { Route, Navigate, PathRouteProps } from "react-router-dom";

// // Extending a specific type of RouteProps if that fits your use case
// interface PrivateRouteProps extends PathRouteProps {
//   element: React.ReactElement;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, ...rest }) => {
//   console.log("Private route works!");

//   const authenticated = false; // authentication logic here

//   // Use Navigate for redirection

//   return (
//     <Route
//       {...rest}
//       element={!authenticated ? <Navigate to="/login" replace /> : element}
//     />
//   );
// };

// export default PrivateRoute;

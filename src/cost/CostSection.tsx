import {
  Box,
  InputAdornment,
  Menu,
  MenuItem,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import CustomButton from "../reusables/Button";
import {
  costGroupType,
  countType,
  groupType,
  groupTypeName,
  polygonType,
  scaleInfoType,
  taxType,
  unitType,
} from "../utils";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { getScaledVolume, polygonArea } from "../reusables/helpers";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import _ from "lodash";
import nextId from "react-id-generator";

type propsType = {
  scaleInfo: scaleInfoType[][];
  group: groupType[];
  polygon: polygonType[][][];
  count: countType[][][];
  toggleShowEstimate: React.Dispatch<React.SetStateAction<boolean>>;
  toggleShowCost: React.Dispatch<React.SetStateAction<boolean>>;
};

const CostSection = ({
  scaleInfo,
  group,
  polygon,
  count,
  toggleShowEstimate,
  toggleShowCost,
}: propsType): JSX.Element => {
  const [costGroup, setCostGroup] = useState<costGroupType[]>([]);
  const [expand, setExpand] = useState<boolean>(true);
  const [totalMaterial, setTotalMaterial] = useState<number>(0);
  const [totalLabor, setTotalLabor] = useState<number>(0);
  const [totalMarkup, setTotalMarkup] = useState<number>(0);
  const [totalTax, setTotalTax] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);

  const [anchorElTax, setAnchorElTax] = useState<null | HTMLElement>(null);
  const openTax = Boolean(anchorElTax);
  const rowIndexForTax = useRef<number>(0);

  const handleToggleTax: MouseEventHandler<HTMLDivElement> = (event) => {
    if (anchorElTax) {
      setAnchorElTax(null);
    } else {
      setAnchorElTax(event?.currentTarget);
    }
    rowIndexForTax.current = +event.currentTarget?.classList[2];
  };
  const handleCloseTax = () => {
    setAnchorElTax(null);
  };

  useEffect(() => {
    const newCostGroup: costGroupType[] = [];

    for (let pdfIndex = 0; pdfIndex < polygon.length; pdfIndex++) {
      for (
        let pageIndex = 0;
        pageIndex < polygon[pdfIndex].length;
        pageIndex++
      ) {
        const polygonPerPage = polygon[pdfIndex][pageIndex];
        const groupPerPage = group.filter(
          (grp) =>
            grp.type === groupTypeName.shape || grp.type === groupTypeName.all
        );
        const scaleInf = scaleInfo[pdfIndex][pageIndex];

        groupPerPage.map((grp) => {
          const poly = polygonPerPage.filter((p) => p.group === grp.id);
          if (grp.type === groupTypeName.shape) {
            const volumePerGroup = +poly
              .map((p, index) => {
                return +getScaledVolume(
                  polygonArea(p.points) -
                    p.deductRect
                      .map((deduct) => polygonArea(deduct.points))
                      .reduce((prev, curr) => prev + curr, 0),
                  scaleInf,
                  grp.id === 1
                    ? scaleInf.calibrated
                      ? "ft"
                      : "px"
                    : scaleInf.calibrated
                    ? grp.unit === unitType.ft
                      ? unitType.ft
                      : unitType.in
                    : "px",
                  p.height || grp.height,
                  p.depth || grp.depth
                ).split(" ")[0];
              })
              .reduce((prev, curr) => prev + curr, 0)
              .toFixed(2);

            if (poly.length) {
              newCostGroup.push({
                id: nextId(),
                name: grp.name,
                quantity: volumePerGroup,
                unit: scaleInf.calibrated
                  ? poly[0].height || grp.height || poly[0].depth || grp.depth
                    ? grp.unit === unitType.ft
                      ? "ft3"
                      : "in3"
                    : grp.unit === unitType.ft
                    ? "ft2"
                    : "in2"
                  : poly[0].height || grp.height || poly[0].depth || grp.depth
                  ? "px3"
                  : "px2",
                material: 0,
                labor: 0,
                markup: 0,
                room: 0,
                tax: 0,
              });
            }
          } else {
            for (const pp of poly) {
              const volumePerGroup = +getScaledVolume(
                polygonArea(pp.points) -
                  pp.deductRect
                    .map((deduct) => polygonArea(deduct.points))
                    .reduce((prev, curr) => prev + curr, 0),
                scaleInf,
                grp.id === 1
                  ? scaleInf.calibrated
                    ? "ft"
                    : "px"
                  : scaleInf.calibrated
                  ? grp.unit === unitType.ft
                    ? unitType.ft
                    : unitType.in
                  : "px",
                pp.height,
                pp.depth
              ).split(" ")[0];

              newCostGroup.push({
                id: nextId(),
                name: pp.name,
                quantity: volumePerGroup,
                unit: scaleInf.calibrated
                  ? pp.height || pp.depth
                    ? grp.unit === unitType.ft
                      ? "ft3"
                      : "in3"
                    : grp.unit === unitType.ft
                    ? "ft2"
                    : "in2"
                  : pp.height || pp.depth
                  ? "px3"
                  : "px2",
                material: 0,
                labor: 0,
                markup: 0,
                room: 0,
                tax: 0,
              });
            }
          }
        });
      }
    }

    for (let pdfIndex = 0; pdfIndex < count.length; pdfIndex++) {
      for (let pageIndex = 0; pageIndex < count[pdfIndex].length; pageIndex++) {
        const countPerPage = count[pdfIndex][pageIndex];
        const groupPerPage = group.filter(
          (grp) =>
            grp.type === groupTypeName.count || grp.type === groupTypeName.all
        );

        groupPerPage.map((grp) => {
          const cnt = countPerPage.filter((c) => c.group === grp.id).length;

          if (cnt) {
            newCostGroup.push({
              id: nextId(),
              name: grp.type === groupTypeName.all ? "count" : grp.name,
              quantity: cnt,
              unit: "Count",
              material: 0,
              labor: 0,
              markup: 0,
              room: 0,
              tax: 0,
            });
          }
        });
      }
    }

    setCostGroup(newCostGroup);
  }, []);

  useEffect(() => {
    setTotalMaterial(
      costGroup
        .map((grp) => grp.quantity * grp.material)
        .reduce((collector, curr) => collector + curr, 0)
    );
    setTotalLabor(
      costGroup
        .map((grp) => grp.quantity * grp.labor)
        .reduce((collector, curr) => collector + curr, 0)
    );
    setTotalMarkup(
      costGroup
        .map((grp) => grp.quantity * grp.markup)
        .reduce((collector, curr) => collector + curr, 0)
    );

    setTotalTax(
      (taxRate / 100.0) *
        costGroup
          .map((grp) => {
            let val = 0;
            if (grp.tax === 1) val = grp.quantity * grp.material;
            if (grp.tax === 2) val = grp.quantity * grp.labor;
            if (grp.tax === 3)
              val = grp.quantity * grp.material + grp.quantity * grp.labor;
            if (val > 0) val += grp.quantity * grp.markup;
            return val;
          })
          .reduce((collector, curr) => collector + curr, 0)
    );
  }, [costGroup, taxRate]);

  const onCostGroupChange = (index: number, field: string, value: number) => {
    console.log(index, field, value);
    if (field === "tax") index = rowIndexForTax.current;

    setCostGroup((prev) => {
      const prevCopy = _.cloneDeep(prev);
      const old = prevCopy[index];
      prevCopy.splice(index, 1, {
        ...old,
        [field]: value,
      });
      return prevCopy;
    });
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          width: "1222px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            marginTop: "30px",
            width: "611px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomButton
            backgroundcolor="#ffa700"
            hoverbackgroudcolor="#ff8700"
            Color="white"
            hovercolor="white"
            sx={{
              borderRadius: "4px",
              padding: "3px 6px",
              height: "35px",
            }}
            onClick={() => {
              toggleShowCost(false);
              toggleShowEstimate(false);
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <ReplyIcon />
              Back to Measure
            </Box>
          </CustomButton>
          <Typography
            sx={{
              color: "#222222",
              fontSize: "24px",
              fontWeight: "500",
            }}
          >
            Estimates
          </Typography>
        </Box>
      </Box>
      <TableSection>
        <Row
          sx={{
            color: "#666",
            fontSize: "16px",
            fontWeight: "500",
            borderBottom: "1px solid rgb(204, 204, 204)",
          }}
        >
          <Field sx={{ width: "250px", border: "none" }}>Item</Field>
          <Field sx={{ width: "120px", border: "none" }}>Quantity</Field>
          <Field sx={{ width: "80px", border: "none" }}>Unit</Field>
          <Field sx={{ width: "120px", border: "none" }}>Material</Field>
          <Field sx={{ width: "120px", border: "none" }}>Labor</Field>
          <Field sx={{ width: "120px", border: "none" }}>Markup</Field>
          <Field sx={{ width: "120px", border: "none" }}>Room</Field>
          <Field sx={{ width: "100px", border: "none" }}>Tax</Field>
          <Field sx={{ width: "150px", border: "none" }}>Total</Field>
        </Row>
        <Row
          sx={{
            color: "rgb(34, 34, 34)",
            fontSize: "16px",
            fontWeight: "500",
            backgroundColor: "#fafafa",
          }}
        >
          <Field
            sx={{ width: "250px", cursor: "pointer" }}
            onClick={() => setExpand((prev) => !prev)}
          >
            {expand ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </Field>
          <Field sx={{ width: "120px" }} />
          <Field sx={{ width: "80px" }} />
          <Field sx={{ width: "120px" }}>${totalMaterial.toFixed(2)}</Field>
          <Field sx={{ width: "120px" }}>${totalLabor.toFixed(2)}</Field>
          <Field sx={{ width: "120px" }}>${totalMarkup.toFixed(2)}</Field>
          <Field sx={{ width: "120px" }} />
          <Field sx={{ width: "100px" }} />
          <Field sx={{ width: "150px", border: "none" }}>
            ${(totalMaterial + totalLabor + totalMarkup).toFixed(2)}
          </Field>
        </Row>
        {expand &&
          costGroup.map((grp, index) => (
            <Row
              key={grp.id}
              sx={{
                color: "#666",
                fontSize: "16px",
                fontWeight: "400",
                borderBottom: "1px solid rgb(204, 204, 204)",
              }}
            >
              <Field sx={{ width: "250px" }}>{grp.name}</Field>
              <Field sx={{ width: "120px" }}>{grp.quantity}</Field>
              <Field sx={{ width: "80px" }}>{grp.unit}</Field>
              <Field sx={{ width: "120px" }}>
                <CustomTextField
                  value={grp.material}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ margin: "0px" }}>
                        $
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    if (+e.target.value >= 0)
                      onCostGroupChange(index, "material", +e.target.value);
                  }}
                />
              </Field>
              <Field sx={{ width: "120px" }}>
                <CustomTextField
                  value={grp.labor}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ margin: "0px" }}>
                        $
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    if (+e.target.value >= 0)
                      onCostGroupChange(index, "labor", +e.target.value);
                  }}
                />
              </Field>
              <Field sx={{ width: "120px" }}>
                <CustomTextField
                  value={grp.markup}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ margin: "0px" }}>
                        $
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    if (+e.target.value >= 0)
                      onCostGroupChange(index, "markup", +e.target.value);
                  }}
                />
              </Field>
              <Field sx={{ width: "120px" }}>
                <CustomTextField placeholder="Add Room" />
              </Field>
              <Field sx={{ width: "100px" }}>
                <CustomTextField
                  id={`${index}`}
                  className={`${index}`}
                  value={taxType[grp.tax]}
                  onClick={handleToggleTax}
                />
                <Menu
                  id="basic-menu"
                  anchorEl={anchorElTax}
                  open={openTax}
                  onClose={handleCloseTax}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  {[0, 1, 2, 3].map((val) => (
                    <MenuItem
                      onClick={() => {
                        handleCloseTax();
                        onCostGroupChange(index, "tax", val);
                        console.log("index", index);
                      }}
                    >
                      {taxType[val]}
                    </MenuItem>
                  ))}
                </Menu>
              </Field>
              <Field sx={{ width: "150px", border: "none" }}>
                $
                {(
                  grp.quantity *
                  (grp.material + grp.labor + grp.markup)
                ).toFixed(2)}
              </Field>
            </Row>
          ))}

        <Box
          sx={{
            marginTop: "20px",
            marginBottom: "10px",
            alignSelf: "flex-end",
            width: "400px",
            paddingTop: "20px",
            borderRadius: "4px",
            border: "1px solid rgb(204, 204, 204)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "0px 20px",
            }}
          >
            <Box sx={{ fontWeight: "500", fontSize: "17px" }}>Subtotal</Box>
            <Box>${totalMaterial + totalLabor}</Box>
          </Box>
          {totalMarkup > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: "0px 20px",
              }}
            >
              <Box sx={{ fontWeight: "500", fontSize: "17px" }}>Markup</Box>
              <Box>${totalMarkup}</Box>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0px 20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ fontWeight: "500", fontSize: "17px" }}>Tax </Box>
              <Typography fontSize="14px">{`  (%)`}</Typography>
              <CustomTextField
                sx={{
                  width: "80px",
                  "& .MuiOutlinedInput-input": {
                    padding: "5px 10px 5px 0px",
                    height: "18px",
                    color: "#666",
                  },
                }}
                value={taxRate}
                onChange={(e) => {
                  if (+e.target.value >= 0) setTaxRate(+e.target.value);
                }}
              />
            </Box>
            <Box>${totalTax.toFixed(2)}</Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "rgb(243, 248, 252)",
              padding: "20px",
              borderBottomLeftRadius: "4px",
              borderBottomRightRadius: "4px",
            }}
          >
            <Box sx={{ fontWeight: "500", fontSize: "20px" }}>Total</Box>
            <Box>${totalMaterial + totalLabor + totalMarkup + totalTax}</Box>
          </Box>
        </Box>
      </TableSection>
    </Box>
  );
};

export default CostSection;

const TableSection = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  boxSizing: "border-box",
  boxShadow: "0px 0px 8px 2px grey",
  borderRadius: "12",
  border: "1px solid #FFBC01",
  marginTop: "20px",
  padding: "20px",
});

const Row = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
});

const Field = styled(Box)({
  padding: "10px 10px",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  height: "50px",
  boxSizing: "border-box",
  borderRight: "1px solid #e6e6e6",
});

const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    paddingLeft: "4px",
    "&. MuiInputAdornment-root": {
      marginRight: "0px",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "5px 10px 5px 0px",
    height: "25px",
    color: "#666",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid transparent",
  },

  ":hover": {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid rgba(0, 0, 0, 0.23)",
    },
  },
});

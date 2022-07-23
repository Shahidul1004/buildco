import {
  Box,
  BoxProps,
  IconButton,
  Menu,
  MenuItem,
  styled,
  Typography,
} from "@mui/material";
import { createRef, useEffect, useRef, useState } from "react";
import {
  countType,
  groupType,
  lengthType,
  polygonType,
  scaleInfoType,
  unitType,
} from "../utils";
import FolderTwoToneIcon from "@mui/icons-material/FolderTwoTone";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { getLength, polygonArea, rgba2hex } from "../reusables/helpers";
import _ from "lodash";
import { ReactComponent as Settings } from "../assets/icons/settingsHeight.svg";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

type propsType = {
  selectedPdf: number;
  selectedPage: number;
  scaleInfo: scaleInfoType;
  group: groupType;
  groups: groupType[];
  groupIndex: number;
  changeGroup: React.Dispatch<React.SetStateAction<groupType[]>>;
  polygon: polygonType[];
  changePolygon: React.Dispatch<React.SetStateAction<polygonType[][][]>>;
  length: lengthType[];
  changeLength: React.Dispatch<React.SetStateAction<lengthType[][][]>>;
  count: countType[];
  changeCount: React.Dispatch<React.SetStateAction<countType[][][]>>;
};

const DefaultGroup = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  group,
  groups,
  groupIndex,
  changeGroup,
  polygon,
  changePolygon,
  length,
  changeLength,
  count,
  changeCount,
}: propsType): JSX.Element => {
  const [expand, setExpand] = useState<boolean>(true);
  const [polyFilteredIndex, setPolyFilteredIndex] = useState<number[]>([]);
  const [lengthFilteredIndex, setLengthFilteredIndex] = useState<number[]>([]);
  const [countFilteredIndex, setCountFilteredIndex] = useState<number[]>([]);
  const polyRowRefs = useRef(polyFilteredIndex.map(() => createRef<any>()));
  const lengthRowRefs = useRef(lengthFilteredIndex.map(() => createRef<any>()));
  const countRowRefs = useRef(countFilteredIndex.map(() => createRef<any>()));
  const [polyRowsHeight, setPolyRowsHeight] = useState<number[]>([]);
  const [lengthRowsHeight, setLengthRowsHeight] = useState<number[]>([]);
  const polygonAreas = useRef<number[]>([]);
  const indivisualLengths = useRef<number[]>([]);
  const groupSize = useRef<number>(0);

  const clickRef = useRef<string>("");
  const [anchorElOption, setAnchorElOption] = useState<null | HTMLElement>(
    null
  );
  const openOption = Boolean(anchorElOption);
  const handleToggleOption = (event: any) => {
    if (anchorElOption) {
      clickRef.current = "";
      setAnchorElOption(null);
    } else {
      clickRef.current = event.currentTarget.id;
      setAnchorElOption(event?.currentTarget);
    }
  };
  const handleCloseOption = () => {
    clickRef.current = "";
    setAnchorElOption(null);
  };

  useEffect(() => {
    const polyIndeces: number[] = [];
    const lengthIndeces: number[] = [];
    const countIndeces: number[] = [];
    polygon.map((poly, index) => {
      if (poly.group === group.id) polyIndeces.push(index);
    });
    length.map((len, index) => {
      if (len.group === group.id) lengthIndeces.push(index);
    });
    count.map((cnt, index) => {
      if (cnt.group === group.id) countIndeces.push(index);
    });

    polygonAreas.current.length = 0;
    for (let idx = 0; idx < polyIndeces.length; idx++) {
      let area = polygonArea(polygon[polyIndeces[idx]].points);
      const deducts = polygon[polyIndeces[idx]].deductRect;
      for (const deduct of deducts) {
        area -= polygonArea(deduct.points);
      }
      polygonAreas.current.push(area);
    }

    indivisualLengths.current.length = 0;
    for (let idx = 0; idx < lengthIndeces.length; idx++) {
      let area = getLength(length[lengthIndeces[idx]].points);
      indivisualLengths.current.push(area);
    }

    groupSize.current = countIndeces.length;

    polyRowRefs.current = polyIndeces.map(() => createRef<HTMLDivElement>());
    lengthRowRefs.current = lengthIndeces.map(() =>
      createRef<HTMLDivElement>()
    );
    countRowRefs.current = countIndeces.map(() => createRef<HTMLDivElement>());

    setPolyRowsHeight((prev) => {
      return polyIndeces.map((e) => 40);
    });
    setLengthRowsHeight((prev) => {
      return lengthIndeces.map((e) => 40);
    });

    setPolyFilteredIndex(polyIndeces);
    setLengthFilteredIndex(lengthIndeces);
    setCountFilteredIndex(countIndeces);
  }, [group, polygon, length, count]);

  return (
    <Container>
      <GroupHeader sx={{ backgroundColor: "#f4f4f4" }}>
        <Field
          sx={{
            padding: "3px",
            width: "100%",
          }}
        >
          <Box
            onClick={() => setExpand((prev) => !prev)}
            sx={{
              display: "flex",
              cursor: "pointer",
              backgroundColor: "#f4f4f4",
              padding: "5px 0px",
            }}
          >
            <FolderTwoToneIcon
              fontSize="small"
              sx={{ color: rgba2hex(group.color) }}
            />
            {!expand ? (
              <ArrowRightIcon
                fontSize="small"
                sx={{ color: rgba2hex(group.color) }}
              />
            ) : (
              <ArrowDropDownIcon
                fontSize="small"
                sx={{ color: rgba2hex(group.color) }}
              />
            )}
          </Box>
          <Box
            sx={{
              width: "100%",
              fontSize: "12px",
              padding: "6px 3px",
            }}
          >
            {group.name}
          </Box>
        </Field>
      </GroupHeader>
      {expand &&
        polyFilteredIndex.map((index, idx) => (
          <Row
            onMouseEnter={() => {
              changePolygon((prev) => {
                const prevCopy = _.cloneDeep(prev);
                prevCopy[selectedPdf][selectedPage][index].hover = true;
                return prevCopy;
              });
            }}
            onMouseLeave={() => {
              changePolygon((prev) => {
                const prevCopy = _.cloneDeep(prev);
                prevCopy[selectedPdf][selectedPage][index].hover = false;
                return prevCopy;
              });
            }}
          >
            <Field
              ref={polyRowRefs.current[idx]!}
              sx={{
                padding: "3px",
                paddingLeft: "10px",
                width: "180px",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: "5px",
                  backgroundColor: rgba2hex(group.color),
                  marginRight: "5px",
                }}
              />
              <Box
                sx={{
                  width: "150px",
                  fontSize: "12px",
                  padding: "6px 3px",
                  ":hover": {
                    backgroundColor: "#f4f4f4",
                  },
                }}
                contentEditable
                onKeyDown={(e) => {
                  setPolyRowsHeight((prev) => {
                    const copy = [...prev];
                    copy.splice(
                      idx,
                      1,
                      polyRowRefs.current[idx].current.clientHeight
                    );
                    return copy;
                  });
                }}
                onBlur={(e) => {
                  changePolygon((prev) => {
                    const prevCopy = _.cloneDeep(prev);
                    const target = prevCopy[selectedPdf][selectedPage][index];
                    target.name = e.target.innerText;
                    prevCopy[selectedPdf][selectedPage][index] = target;
                    return prevCopy;
                  });
                }}
              >
                {polygon[index]?.name}
              </Box>
            </Field>
            <Field
              sx={{
                height: `${polyRowsHeight[idx]}px`,
                width: "90px",
              }}
            >
              <Typography
                fontSize={12}
                sx={{
                  height: "100%",
                  paddingLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {scaleInfo.calibrated === false
                  ? `${polygonAreas.current[idx].toFixed(2)} px2`
                  : group.unit === unitType.ft
                  ? `${(
                      (polygonAreas.current[idx] * scaleInfo.L * scaleInfo.L) /
                      (1.0 * scaleInfo.x * scaleInfo.x +
                        scaleInfo.y * scaleInfo.y)
                    ).toFixed(2)} ft2`
                  : `${(
                      (polygonAreas.current[idx] *
                        scaleInfo.L *
                        scaleInfo.L *
                        144) /
                      (1.0 * scaleInfo.x * scaleInfo.x +
                        scaleInfo.y * scaleInfo.y)
                    ).toFixed(2)} in2`}
              </Typography>
            </Field>
            <Field
              sx={{
                padding: "0px 10px",
                width: "40px",
                cursor: "pointer",
                ":hover": {
                  backgroundColor: "#f4f4f4",
                },
              }}
            >
              <Settings fill={polygon[index]?.hover ? "#0066c3" : "#c3c3ca"} />
            </Field>
            <Field
              sx={{
                height: `${polyRowsHeight[idx]}px`,
                width: "90px",
              }}
            >
              <Typography
                fontSize={12}
                sx={{
                  height: "100%",
                  paddingLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {scaleInfo.calibrated === false
                  ? `${polygonAreas.current[idx].toFixed(2)} px2`
                  : group.unit === unitType.ft
                  ? `${(
                      (polygonAreas.current[idx] * scaleInfo.L * scaleInfo.L) /
                      (1.0 * scaleInfo.x * scaleInfo.x +
                        scaleInfo.y * scaleInfo.y)
                    ).toFixed(2)} ft2`
                  : `${(
                      (polygonAreas.current[idx] *
                        scaleInfo.L *
                        scaleInfo.L *
                        144) /
                      (1.0 * scaleInfo.x * scaleInfo.x +
                        scaleInfo.y * scaleInfo.y)
                    ).toFixed(2)} in2`}
              </Typography>
            </Field>
            <Field sx={{ width: "50px", justifyContent: "center" }}>
              <IconButton id={`polygon ${index}`} onClick={handleToggleOption}>
                <MoreHorizIcon
                  sx={{ color: polygon[index]?.hover ? "#0066c3" : "inherit" }}
                />
              </IconButton>
            </Field>
          </Row>
        ))}
      {expand &&
        lengthFilteredIndex.map((index, idx) => (
          <Row
            onMouseEnter={() => {
              changeLength((prev) => {
                const prevCopy = _.cloneDeep(prev);
                prevCopy[selectedPdf][selectedPage][index].hover = true;
                return prevCopy;
              });
            }}
            onMouseLeave={() => {
              changeLength((prev) => {
                const prevCopy = _.cloneDeep(prev);
                prevCopy[selectedPdf][selectedPage][index].hover = false;
                return prevCopy;
              });
            }}
          >
            <Field
              ref={lengthRowRefs.current[idx]!}
              sx={{
                padding: "3px",
                paddingLeft: "10px",
                width: "180px",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: "5px",
                  backgroundColor: rgba2hex(group.color),
                  marginRight: "5px",
                }}
              />
              <Box
                sx={{
                  width: "150px",
                  fontSize: "12px",
                  padding: "6px 3px",
                  ":hover": {
                    backgroundColor: "#f4f4f4",
                  },
                }}
                contentEditable
                onKeyDown={(e) => {
                  setLengthRowsHeight((prev) => {
                    const copy = [...prev];
                    copy.splice(
                      idx,
                      1,
                      lengthRowRefs.current[idx].current.clientHeight
                    );
                    return copy;
                  });
                }}
                onBlur={(e) => {
                  changeLength((prev) => {
                    const prevCopy = _.cloneDeep(prev);
                    const target = prevCopy[selectedPdf][selectedPage][index];
                    target.name = e.target.innerText;
                    prevCopy[selectedPdf][selectedPage][index] = target;
                    return prevCopy;
                  });
                }}
              >
                {length[index]?.name}
              </Box>
            </Field>
            <Field
              sx={{
                height: `${lengthRowsHeight[idx]}px`,
                width: "90px",
              }}
            >
              <Typography
                fontSize={12}
                sx={{
                  height: "100%",
                  paddingLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {scaleInfo.calibrated === false
                  ? `${indivisualLengths.current[idx].toFixed(2)} px`
                  : group.unit === unitType.ft
                  ? `${(
                      (indivisualLengths.current[idx] * scaleInfo.L) /
                      Math.sqrt(
                        scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y
                      )
                    ).toFixed(2)} ft`
                  : `${(
                      (indivisualLengths.current[idx] * scaleInfo.L * 12) /
                      Math.sqrt(
                        scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y
                      )
                    ).toFixed(2)} in`}
              </Typography>
            </Field>
            <Field
              sx={{
                padding: "0px 10px",
                width: "40px",
                cursor: "pointer",
                ":hover": {
                  backgroundColor: "#f4f4f4",
                },
              }}
            >
              <Settings fill={length[index]?.hover ? "#0066c3" : "#c3c3ca"} />
            </Field>
            <Field
              sx={{
                height: `${lengthRowsHeight[idx]}px`,
                width: "90px",
              }}
            >
              <Typography
                fontSize={12}
                sx={{
                  height: "100%",
                  paddingLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {scaleInfo.calibrated === false
                  ? `${indivisualLengths.current[idx].toFixed(2)} px`
                  : group.unit === unitType.ft
                  ? `${(
                      (indivisualLengths.current[idx] * scaleInfo.L) /
                      Math.sqrt(
                        scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y
                      )
                    ).toFixed(2)} ft`
                  : `${(
                      (indivisualLengths.current[idx] * scaleInfo.L * 12) /
                      Math.sqrt(
                        scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y
                      )
                    ).toFixed(2)} in`}
              </Typography>
            </Field>
            <Field sx={{ width: "50px", justifyContent: "center" }}>
              <IconButton id={`length ${index}`} onClick={handleToggleOption}>
                <MoreHorizIcon
                  sx={{ color: length[index]?.hover ? "#0066c3" : "inherit" }}
                />
              </IconButton>
            </Field>
          </Row>
        ))}
      {expand && countFilteredIndex.length > 0 && (
        <Row
          onMouseEnter={() => {
            changeCount((prev) => {
              const prevCopy = _.cloneDeep(prev);
              const countList = prevCopy[selectedPdf][selectedPage];
              for (const filterIndex of countFilteredIndex) {
                countList[filterIndex].hover = true;
              }
              prevCopy[selectedPdf][selectedPage] = countList;
              return prevCopy;
            });
          }}
          onMouseLeave={() => {
            changeCount((prev) => {
              const prevCopy = _.cloneDeep(prev);
              const countList = prevCopy[selectedPdf][selectedPage];
              for (const filterIndex of countFilteredIndex) {
                countList[filterIndex].hover = false;
              }
              prevCopy[selectedPdf][selectedPage] = countList;
              return prevCopy;
            });
          }}
        >
          <Field
            sx={{
              padding: "3px",
              paddingLeft: "10px",
              width: "180px",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: "5px",
                backgroundColor: rgba2hex(group.color),
                marginRight: "5px",
              }}
            />
            <Box
              sx={{
                width: "150px",
                fontSize: "12px",
                padding: "6px 3px",
                ":hover": {
                  backgroundColor: "#f4f4f4",
                },
              }}
            >
              count
            </Box>
          </Field>
          <Field
            sx={{
              width: "90px",
            }}
          >
            <Typography
              fontSize={12}
              sx={{
                height: "100%",
                paddingLeft: "5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {`count ${groupSize.current}`}
            </Typography>
          </Field>
          <Field
            sx={{
              padding: "0px 10px",
              width: "40px",
              cursor: "pointer",
              ":hover": {
                backgroundColor: "#f4f4f4",
              },
            }}
          >
            <Settings
              fill={count[countFilteredIndex[0]]?.hover ? "#0066c3" : "#c3c3ca"}
            />
          </Field>
          <Field
            sx={{
              width: "90px",
            }}
          >
            <Typography
              fontSize={12}
              sx={{
                height: "100%",
                paddingLeft: "5px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {`count ${groupSize.current}`}
            </Typography>
          </Field>
          <Field sx={{ width: "50px", justifyContent: "center" }}>
            <IconButton id={`count -1`} onClick={handleToggleOption}>
              <MoreHorizIcon
                sx={{
                  color: count[countFilteredIndex[0]]?.hover
                    ? "#0066c3"
                    : "inherit",
                }}
              />
            </IconButton>
          </Field>
        </Row>
      )}

      <Menu
        id="basic-menu"
        anchorEl={anchorElOption}
        open={openOption}
        onClose={handleCloseOption}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{ zIndex: 20000 }}
      >
        <MenuItem
          onClick={() => {
            const clickedRowType = clickRef.current.split(" ")[0];
            const clickedRowIndex = clickRef.current.split(" ")[1];
            if (clickedRowType === "polygon") {
              changePolygon((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const polyList = prevCopy[selectedPdf][selectedPage];
                polyList.splice(+clickedRowIndex, 1);
                prevCopy[selectedPdf][selectedPage] = polyList;
                return prevCopy;
              });
            } else if (clickedRowType === "length") {
              changeLength((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const lengthList = prevCopy[selectedPdf][selectedPage];
                lengthList.splice(+clickedRowIndex, 1);
                prevCopy[selectedPdf][selectedPage] = lengthList;
                return prevCopy;
              });
            } else {
              changeCount((prev) => {
                const prevCopy = _.cloneDeep(prev);
                for (let i = 0; i < prevCopy.length; i++) {
                  for (let j = 0; j < prevCopy[i].length; j++) {
                    prevCopy[i][j] = prevCopy[i][j].filter(
                      (cnt) => cnt.group !== group.id
                    );
                  }
                }
                return prevCopy;
              });
            }
            handleCloseOption();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default DefaultGroup;

const Container = styled(Box)({
  minHeight: "35px",
  boxSizing: "border-box",
  width: "100%",
  borderBottom: "1px solid #d6dae5",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
});

const GroupHeader = styled(Box)({
  boxShadow: "border-box",
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  borderBottom: "1px solid #d6dae5",
});

const Row = styled(Box)({
  boxShadow: "border-box",
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
});

const Field = styled(Box)<BoxProps>({
  boxSizing: "border-box",
  minHeight: "40px",
  height: "100%",
  color: "#666666",
  borderRight: "1px solid #d6dae5",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
});

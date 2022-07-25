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
import { groupType, polygonType, scaleInfoType, unitType } from "../utils";
import FolderTwoToneIcon from "@mui/icons-material/FolderTwoTone";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { polygonArea, rgba2hex } from "../reusables/helpers";
import _ from "lodash";
import { ReactComponent as Settings } from "../assets/icons/settingsHeight.svg";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditGroupModal from "../modal/EditGroupModal";

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
};

const ShapeGroup = ({
  selectedPdf,
  selectedPage,
  scaleInfo,
  group,
  groups,
  groupIndex,
  changeGroup,
  polygon,
  changePolygon,
}: propsType): JSX.Element => {
  const [hover, setHover] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(true);
  const [filteredIndex, setFilteredIndex] = useState<number[]>([]);
  const polygonAreas = useRef<number[]>([]);
  const totalArea = useRef<number>(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(40);
  const rowRefs = useRef(filteredIndex.map(() => createRef<any>()));
  const [rowsHeight, setRowsHeight] = useState<number[]>([]);

  const [modalType, setModalType] = useState<string>("");
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
    const indeces: number[] = [];
    polygon.map((poly, index) => {
      if (poly.group === group.id) indeces.push(index);
    });
    polygonAreas.current.length = 0;
    let total = 0.0;
    for (let idx = 0; idx < indeces.length; idx++) {
      let area = polygonArea(polygon[indeces[idx]].points);
      const deducts = polygon[indeces[idx]].deductRect;
      for (const deduct of deducts) {
        area -= polygonArea(deduct.points);
      }
      polygonAreas.current.push(area);
      total += area;
    }
    totalArea.current = total;

    rowRefs.current = indeces.map(() => createRef<HTMLDivElement>());
    setRowsHeight((prev) => {
      return indeces.map((e) => 40);
    });

    setFilteredIndex(indeces);
  }, [group, polygon]);

  return (
    <Container>
      <GroupHeader
        onMouseEnter={() => {
          changePolygon((prev) => {
            const prevCopy = _.cloneDeep(prev);
            const polyList = prevCopy[selectedPdf][selectedPage];
            for (const filterIndex of filteredIndex) {
              polyList[filterIndex].hover = true;
            }
            prevCopy[selectedPdf][selectedPage] = polyList;
            return prevCopy;
          });
          setHover(true);
        }}
        onMouseLeave={() => {
          changePolygon((prev) => {
            const prevCopy = _.cloneDeep(prev);
            const polyList = prevCopy[selectedPdf][selectedPage];
            for (const filterIndex of filteredIndex) {
              polyList[filterIndex].hover = false;
            }
            prevCopy[selectedPdf][selectedPage] = polyList;
            return prevCopy;
          });
          setHover(false);
        }}
      >
        <Field
          ref={headerRef}
          sx={{
            padding: "3px",
            width: "180px",
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
              width: "130px",
              fontSize: "12px",
              padding: "6px 3px",
              "&:hover": {
                backgroundColor: "#f4f4f4",
              },
            }}
            contentEditable
            onKeyDown={(e) => {
              setHeaderHeight(headerRef.current?.clientHeight!);
            }}
            onBlur={(e) => {
              changeGroup((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const target = prevCopy[groupIndex];
                prevCopy.splice(groupIndex, 1, {
                  ...target,
                  name: e.target.innerText,
                });
                return prevCopy;
              });
            }}
          >
            {group.name}
          </Box>
        </Field>
        <Field
          sx={{
            height: `${headerHeight}px`,
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
              ? `${totalArea.current.toFixed(2)} px2`
              : group.unit === unitType.ft
              ? `${(
                  (totalArea.current * scaleInfo.L * scaleInfo.L) /
                  (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
                ).toFixed(2)} ft2`
              : `${(
                  (totalArea.current * scaleInfo.L * scaleInfo.L * 144) /
                  (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
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
          <Settings fill={hover ? "#0066c3" : "#c3c3ca"} />
        </Field>
        <Field
          sx={{
            height: `${headerHeight}px`,
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
              ? `${totalArea.current.toFixed(2)} px2`
              : group.unit === unitType.ft
              ? `${(
                  (totalArea.current * scaleInfo.L * scaleInfo.L) /
                  (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
                ).toFixed(2)} ft2`
              : `${(
                  (totalArea.current * scaleInfo.L * scaleInfo.L * 144) /
                  (1.0 * scaleInfo.x * scaleInfo.x + scaleInfo.y * scaleInfo.y)
                ).toFixed(2)} in2`}
          </Typography>
        </Field>
        <Field sx={{ width: "60px", justifyContent: "center" }}>
          <IconButton id="groupHeader" onClick={handleToggleOption}>
            <MoreHorizIcon sx={{ color: hover ? "#0066c3" : "inherit" }} />
          </IconButton>
        </Field>
      </GroupHeader>
      {expand &&
        filteredIndex.map((index, idx) => (
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
              ref={rowRefs.current[idx]!}
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
                  setRowsHeight((prev) => {
                    const copy = [...prev];
                    copy.splice(
                      idx,
                      1,
                      rowRefs.current[idx].current.clientHeight
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
                height: `${rowsHeight[idx]}px`,
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
              }}
            />
            <Field
              sx={{
                height: `${rowsHeight[idx]}px`,
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
            <Field sx={{ width: "60px", justifyContent: "center" }}>
              <IconButton id={`${index}`} onClick={handleToggleOption}>
                <MoreHorizIcon
                  sx={{
                    ":hover": {
                      color: "#0066c3",
                    },
                  }}
                />
              </IconButton>
            </Field>
          </Row>
        ))}

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
        {clickRef.current === "groupHeader" && (
          <MenuItem
            onClick={() => {
              handleCloseOption();
              setModalType("edit");
            }}
          >
            Edit
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            if (clickRef.current === "groupHeader") {
              changePolygon((prev) => {
                const prevCopy = _.cloneDeep(prev);
                for (let i = 0; i < prevCopy.length; i++) {
                  for (let j = 0; j < prevCopy[i].length; j++) {
                    prevCopy[i][j] = prevCopy[i][j].filter(
                      (poly) => poly.group !== group.id
                    );
                  }
                }
                return prevCopy;
              });
              changeGroup((prev) => {
                const prevCopy = _.cloneDeep(prev);
                prevCopy.splice(groupIndex, 1);
                return prevCopy;
              });
            } else {
              changePolygon((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const polyList = prevCopy[selectedPdf][selectedPage];
                polyList.splice(+clickRef.current, 1);
                prevCopy[selectedPdf][selectedPage] = polyList;
                return prevCopy;
              });
              setFilteredIndex([]);
            }
            handleCloseOption();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      {modalType === "edit" && (
        <EditGroupModal
          group={groups}
          groupId={group.id}
          changeGroup={changeGroup}
          onClose={() => setModalType("")}
        />
      )}
    </Container>
  );
};

export default ShapeGroup;

const Container = styled(Box)({
  minHeight: "35px",
  boxSizing: "border-box",
  width: "460px",
  borderLeft: "1px solid #d6dae5",
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

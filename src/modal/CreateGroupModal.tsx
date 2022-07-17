import {
  Box,
  Menu,
  MenuItem,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CustomButton from "../reusables/Button";
import { groupType, groupTypeName, iconType, unitType } from "../utils";
import { RGBColor, SketchPicker } from "react-color";
import { MouseEventHandler, useRef, useState } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CircleIcon from "@mui/icons-material/Circle";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import { rgba2hex } from "../reusables/helpers";

type propTypes = {
  changeGroup: React.Dispatch<React.SetStateAction<groupType[]>>;
  onClose: () => void;
  newGroupType: groupTypeName;
};
const CreateGroupModal = ({
  changeGroup,
  onClose,
  newGroupType,
}: propTypes): JSX.Element => {
  const theme = useTheme();
  const textRef = useRef<any>(null);
  const [anchorElUnit, setAnchorElUnit] = useState<null | HTMLElement>(null);
  const openUnit = Boolean(anchorElUnit);
  const [anchorElIcon, setAnchorElIcon] = useState<null | HTMLElement>(null);
  const openIcon = Boolean(anchorElIcon);
  const [color, setColor] = useState<RGBColor>({
    r: 50,
    g: 50,
    b: 50,
    a: 1,
  });
  const [unit, setUnit] = useState<unitType>(unitType.ft);
  const [icon, setIcon] = useState<iconType>(iconType.circle);

  const handleToggleUnit: MouseEventHandler<HTMLDivElement> = (event) => {
    if (anchorElUnit) {
      setAnchorElUnit(null);
    } else {
      setAnchorElUnit(event?.currentTarget);
    }
  };
  const handleCloseUnit = () => {
    setAnchorElUnit(null);
  };
  const handleToggleIcon: MouseEventHandler<HTMLDivElement> = (event) => {
    if (anchorElIcon) {
      setAnchorElIcon(null);
    } else {
      setAnchorElIcon(event?.currentTarget);
    }
  };
  const handleCloseIcon = () => {
    setAnchorElIcon(null);
  };

  const handleCreate = () => {
    onClose();
    changeGroup((prev) => [
      ...prev,
      {
        id: new Date().getTime(),
        name: textRef.current.value,
        type: newGroupType,
        color: color,
        [newGroupType === groupTypeName.count ? "icon" : "unit"]:
          newGroupType === groupTypeName.count ? icon : unit,
      },
    ]);
  };
  return (
    <>
      <OverLay />
      <ModalContainer>
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexFlow: "column nowrap",
            jusifyContent: "flex-start",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <CreateNewFolderIcon />
          <Typography fontWeight="500">Create New Group</Typography>

          <Box
            sx={{
              marginTop: "20px",
              width: "95%",
              display: "flex",
              flexFlow: "column nowrap",
              alignItems: "flex-start",
            }}
          >
            <Typography fontSize={14}>Group name</Typography>
            <TextField
              fullWidth
              inputRef={textRef}
              sx={{
                "& .MuiOutlinedInput-input": {
                  padding: "10px",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              marginTop: "10px",
              width: "95%",
              display: "flex",
              flexFlow: "row nowrap",
              justifyContent: "space-evenly",
              alignItems: "flex-start",
              gap: "50px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexFlow: "column nowrap",
                alignItems: "flex-start",
              }}
            >
              <Typography fontSize={14}>Color</Typography>
              <SketchPicker
                color={color}
                onChange={(color) => {
                  setColor(color.rgb);
                }}
                width="170px"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexFlow: "column nowrap",
                alignItems: "flex-start",
              }}
            >
              {(newGroupType === groupTypeName.all ||
                newGroupType === groupTypeName.shape ||
                newGroupType === groupTypeName.length) && (
                <Box
                  sx={{
                    display: "flex",
                    flexFlow: "column nowrap",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography fontSize={14}>Unit</Typography>
                  <Box
                    onClick={handleToggleUnit}
                    sx={{
                      width: "50px",
                      display: "flex",
                      alignitems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      backgroundColor: "#f4f4f4",
                      padding: "2px 6px",
                      ":hover": {
                        backgroundColor: "#e4e7ed",
                      },
                    }}
                  >
                    <Typography
                      noWrap
                      fontWeight="400"
                      lineHeight="1.5"
                      letterSpacing="0.00938em"
                      fontSize="14px"
                      sx={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {unit}
                    </Typography>
                    {openUnit ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowUpIcon />
                    )}
                  </Box>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorElUnit}
                    open={openUnit}
                    onClose={handleCloseUnit}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    sx={{
                      paddingTop: "0px",
                      "& .MuiPaper-root": {
                        minWidth: "50px",
                      },
                    }}
                  >
                    {["ft", "in"].map((unt, index) => (
                      <MenuItem
                        key={index}
                        selected={unt === unit}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "10px",
                          color: theme.color.primary,
                          fontSize: "14px",
                        }}
                      >
                        <Typography
                          onClick={() => {
                            handleCloseUnit();
                            setUnit(
                              unt === unitType.ft ? unitType.ft : unitType.in
                            );
                          }}
                          noWrap
                          sx={{
                            maxWidth: "400px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            flexGrow: 1,
                            fontSize: "15px",
                          }}
                        >
                          {unt}
                        </Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              )}
              {(newGroupType === groupTypeName.all ||
                newGroupType === groupTypeName.count) && (
                <Box
                  sx={{
                    display: "flex",
                    flexFlow: "column nowrap",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography fontSize={14}>Icon</Typography>
                  <Box
                    onClick={handleToggleIcon}
                    sx={{
                      width: "50px",
                      display: "flex",
                      alignitems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      backgroundColor: "#f4f4f4",
                      padding: "2px 6px",
                      ":hover": {
                        backgroundColor: "#e4e7ed",
                      },
                    }}
                  >
                    <Typography
                      noWrap
                      fontWeight="400"
                      lineHeight="1.5"
                      letterSpacing="0.00938em"
                      fontSize="14px"
                      sx={{
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {icon === iconType.circle ? (
                        <CircleIcon sx={{ color: rgba2hex(color) }} />
                      ) : icon === iconType.triangle ? (
                        <ChangeHistoryIcon sx={{ color: rgba2hex(color) }} />
                      ) : (
                        <CropSquareIcon sx={{ color: rgba2hex(color) }} />
                      )}
                    </Typography>
                    {openIcon ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowUpIcon />
                    )}
                  </Box>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorElIcon}
                    open={openIcon}
                    onClose={handleCloseIcon}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    sx={{
                      paddingTop: "0px",
                      "& .MuiPaper-root": {
                        minWidth: "50px",
                      },
                    }}
                  >
                    {["CircleIcon", "ChangeHistoryIcon", "CropSquareIcon"].map(
                      (icn, index) => (
                        <MenuItem
                          key={index}
                          selected={icon === icn}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "10px",
                            color: theme.color.primary,
                            fontSize: "14px",
                          }}
                        >
                          <Typography
                            onClick={() => {
                              handleCloseIcon();
                              setIcon(
                                icn === iconType.circle
                                  ? iconType.circle
                                  : icn === iconType.triangle
                                  ? iconType.triangle
                                  : iconType.square
                              );
                            }}
                            noWrap
                            sx={{
                              maxWidth: "400px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              flexGrow: 1,
                              fontSize: "15px",
                            }}
                          >
                            {icn === iconType.circle ? (
                              <CircleIcon sx={{ color: rgba2hex(color) }} />
                            ) : icn === iconType.triangle ? (
                              <ChangeHistoryIcon
                                sx={{ color: rgba2hex(color) }}
                              />
                            ) : (
                              <CropSquareIcon sx={{ color: rgba2hex(color) }} />
                            )}
                          </Typography>
                        </MenuItem>
                      )
                    )}
                  </Menu>
                </Box>
              )}
            </Box>
          </Box>

          <Box sx={{ marginTop: "25px", display: "flex", gap: "10px" }}>
            <CustomButton
              variant="outlined"
              onClick={onClose}
              sx={{
                padding: "6px",
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              variant="contained"
              Color="white"
              hovercolor="white"
              backgroundcolor="primary.main"
              hoverbackgroudcolor="primary.dark"
              onClick={handleCreate}
              sx={{
                padding: "6px 20px",
              }}
            >
              Create Group
            </CustomButton>
          </Box>
        </Box>
      </ModalContainer>
    </>
  );
};
export default CreateGroupModal;

const OverLay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  zIndex: 1000,
});

const ModalContainer = styled(Box)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  zIndex: 1000,
  borderRadius: "5px",
});
import {
  Box,
  BoxProps,
  Menu,
  MenuItem,
  MenuProps,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import {
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Context } from "../Context";
import _ from "lodash";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  activeGroupType,
  activeToolOptions,
  groupType,
  groupTypeName,
} from "../utils";
import CustomButton from "../reusables/Button";
import CreateGroupModal from "../modal/CreateGroupModal";
import DeleteModal from "../modal/DeleteModal";
import EditGroupModal from "../modal/EditGroupModal";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import { rgba2hex } from "../reusables/helpers";
import CreatePortal from "../reusables/CreatePortal";

type propsType = {
  activeTool: activeToolOptions;
  group: groupType[];
  changeGroup: React.Dispatch<React.SetStateAction<groupType[]>>;
  activeGroup: activeGroupType;
  changeActiveGroup: React.Dispatch<React.SetStateAction<activeGroupType>>;
};

const GroupSection = ({
  activeTool,
  group,
  changeGroup,
  activeGroup,
  changeActiveGroup,
}: propsType): JSX.Element => {
  const [filteredGroups, setFilteredGroups] = useState<groupType[]>([]);
  const anchorElOptionId = useRef<any>(null);
  const context = useContext(Context);
  const theme = useTheme();

  const [modalType, setModalType] = useState<string>("");
  const handleOpenModal = (type: "delete" | "edit" | "create") => {
    if (type === "create") handleCloseList();
    setModalType(type);
  };

  const [anchorElList, setAnchorElList] = useState<null | HTMLElement>(null);
  const openList = Boolean(anchorElList);
  const [anchorElOption, setAnchorElOption] = useState<null | HTMLElement>(
    null
  );
  const openOption = Boolean(anchorElOption);
  const [anchorElColor, setAnchorElColor] = useState<null | HTMLElement>(null);
  const openColor = Boolean(anchorElColor);

  const currentGroup = filteredGroups.find(
    (grp) =>
      grp.id ===
      (activeTool === activeToolOptions.count
        ? activeGroup.count
        : activeTool === activeToolOptions.length
        ? activeGroup.length
        : activeGroup.shape)
  );

  useEffect(() => {
    const groupName =
      activeTool === activeToolOptions.count
        ? groupTypeName.count
        : activeTool === activeToolOptions.length
        ? groupTypeName.length
        : groupTypeName.shape;

    const availableGroups = group.filter((grp) => {
      return grp.type === groupName || grp.type === groupTypeName.all;
    });
    let found = false;
    for (const grp of availableGroups) {
      if (
        grp.id ===
        (activeTool === activeToolOptions.count
          ? activeGroup.count
          : activeTool === activeToolOptions.length
          ? activeGroup.length
          : activeGroup.shape)
      ) {
        found = true;
        break;
      }
    }
    if (!found)
      activeTool === activeToolOptions.count
        ? changeActiveGroup((prev) => {
            return { ...prev, count: 1 };
          })
        : activeTool === activeToolOptions.length
        ? changeActiveGroup((prev) => {
            return { ...prev, length: 1 };
          })
        : changeActiveGroup((prev) => {
            return { ...prev, shape: 1 };
          });
    setFilteredGroups(availableGroups);
  }, [group, activeTool]);

  console.log(filteredGroups);

  const handleToggleList: MouseEventHandler<HTMLDivElement> = (event) => {
    if (anchorElList) {
      setAnchorElList(null);
    } else {
      setAnchorElList(event?.currentTarget);
    }
  };
  const handleToggleOption = (event: any) => {
    if (anchorElOption) {
      setAnchorElOption(null);
    } else {
      setAnchorElOption(event?.currentTarget);
    }
  };
  const handleToggleColor: MouseEventHandler<HTMLDivElement> = (event) => {
    if (anchorElColor) {
      setAnchorElColor(null);
    } else {
      setAnchorElColor(event?.currentTarget);
    }
  };

  const handleCloseList = () => {
    setAnchorElList(null);
  };
  const handleCloseOption = () => {
    anchorElOptionId.current = anchorElOption?.id;
    setAnchorElOption(null);
    setAnchorElList(null);
  };
  const handleCloseColor = () => {
    setAnchorElColor(null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <Typography
        color="#272424"
        fontSize="17px"
        fontWeight="500"
        fontStyle="normal"
        lineHeight="14px"
      >
        Group
      </Typography>

      <Box
        onClick={handleToggleList}
        sx={{
          width: "230px",
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <CreateNewFolderIcon
            fontSize="small"
            sx={{
              color: rgba2hex(currentGroup?.color),
            }}
          />

          <Typography
            noWrap
            fontWeight="500"
            lineHeight="1.5"
            letterSpacing="0.00938em"
            fontSize="14px"
            sx={{
              color: "#4b4646",
              maxWidth: "180px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentGroup?.name}
          </Typography>
        </Box>
        {openList ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      </Box>

      <Menu
        id="basic-menu"
        anchorEl={anchorElList}
        open={openList}
        onClose={handleCloseList}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          zIndex: 800,
          marginTop: "10px",

          "& .MuiPaper-root": {
            padding: "20px 10px",
            width: "280px",
            minHeight: "60px",
            maxHeight: "300px",
            borderRadius: "0px 0px 8px 8px",
            boxShadow: "0px 1px 4px 0px grey",
          },
        }}
      >
        {filteredGroups.map((group, index) => (
          <MenuItem
            key={index}
            selected={group.id === currentGroup?.id}
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
                handleCloseList();
                if (activeTool === activeToolOptions.count)
                  changeActiveGroup((prev) => {
                    return { ...prev, count: group.id };
                  });
                else if (activeTool === activeToolOptions.length)
                  changeActiveGroup((prev) => {
                    return { ...prev, length: group.id };
                  });
                else
                  changeActiveGroup((prev) => {
                    return { ...prev, shape: group.id };
                  });
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
              {group.name}
            </Typography>
            {group.id !== 1 && (
              <MoreHorizIcon
                id={group.id.toString()}
                onClick={handleToggleOption}
              />
            )}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        id="basic-menu2"
        anchorEl={anchorElOption}
        open={openOption}
        onClose={handleCloseOption}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {anchorElOption?.id !== "1" && (
          <>
            <MenuItem
              onClick={() => {
                handleOpenModal("delete");
                handleCloseOption();
              }}
            >
              Delete
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseOption();
                handleOpenModal("edit");
              }}
            >
              Edit
            </MenuItem>
          </>
        )}
      </Menu>

      <CustomButton
        backgroundcolor="#ffa700"
        hoverbackgroudcolor="#ff8700"
        Color="white"
        hovercolor="white"
        sx={{
          borderRadius: "10px",
          padding: "3px 6px",
          boxShadow: "0px 1px 3px 0px gray",
          ":hover": {
            boxShadow: "0px 1px 5px 0px gray",
          },
        }}
        onClick={() => handleOpenModal("create")}
      >
        New Group
      </CustomButton>

      {modalType === "create" && (
        <CreatePortal>
          <CreateGroupModal
            changeGroup={changeGroup}
            onClose={() => setModalType("")}
            newGroupType={
              activeTool === activeToolOptions.count
                ? groupTypeName.count
                : activeTool === activeToolOptions.length
                ? groupTypeName.length
                : groupTypeName.shape
            }
          />
        </CreatePortal>
      )}
      {modalType === "delete" && (
        <DeleteModal
          type="Group"
          onClose={() => setModalType("")}
          onDelete={() => {
            changeGroup((prev) => {
              const prevCopy = _.cloneDeep(prev);

              const updatedGroup = prevCopy.filter(
                (grp) => grp.id.toString() !== anchorElOptionId.current
              );
              return updatedGroup;
            });
          }}
        />
      )}
      {modalType === "edit" && (
        <EditGroupModal
          onClose={() => setModalType("")}
          groupId={+anchorElOptionId.current}
          group={group}
          changeGroup={changeGroup}
        />
      )}
    </Box>
  );
};

export default GroupSection;

const GroupContainer = styled(Box)({
  position: "fixed",
  top: "50px",
  left: "800px",
  width: "230px",
  backgroundColor: "white",
  borderRadius: "32px",
  boxShadow: "0px 1px 4px 0px gray",
  padding: "10px",
  paddingTop: "70px",
  paddingLeft: "30px",
  paddingRight: "30px",
  display: "flex",
  alignItems: "center",
  zIndex: 700,
});

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    zIndex: -10,
    borderRadius: 0,
    marginTop: "10px",
    minWidth: 180,
    backgroundColor: "red",

    // color:
    //   theme.palette.mode === "light"
    //     ? "rgb(55, 65, 81)"
    //     : theme.palette.grey[300],
    // boxShadow:
    //   "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",

    // "& .MuiMenu-list": {
    //   padding: "4px 0",
    // },
    // "& .MuiMenuItem-root": {
    //   "& .MuiSvgIcon-root": {
    //     fontSize: 18,
    //     color: theme.palette.text.secondary,
    //     marginRight: theme.spacing(1.5),
    //   },
    //   "&:active": {
    //     backgroundColor: alpha(
    //       theme.palette.primary.main,
    //       theme.palette.action.selectedOpacity
    //     ),
    //   },
    // },
  },
}));

interface CustomBoxProps extends BoxProps {
  navHeight: string;
}
const Container = styled(Box)<CustomBoxProps>(({ theme, navHeight }) => ({
  position: "fixed",
  top: `calc( ${navHeight} + 2px)`,
  left: "350px",
  backgroundColor: "white",
  height: "50px",
  width: "450px",
  boxShadow:
    "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
  zIndex: 1200,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",
}));

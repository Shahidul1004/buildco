import {
  Box,
  BoxProps,
  Menu,
  MenuItem,
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
    <>
      <Container navHeight={context.navHeight}>
        <Typography
          color={theme.color.secondary}
          fontSize="16px"
          fontWeight="400"
          fontStyle="normal"
          lineHeight="14px"
        >
          Group
        </Typography>

        <Box
          onClick={handleToggleList}
          sx={{
            width: "250px",
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
            }}
          >
            <CreateNewFolderIcon
              sx={{
                color: rgba2hex(currentGroup?.color),
              }}
            />

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
          sx={{
            paddingTop: "0px",
            "& .MuiPaper-root": {
              // maxWidth: "350px",
              minWidth: "300px",
              minHeight: "30px",
              maxHeight: "600px",
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
          sx={{
            padding: "3px 6px",
          }}
          onClick={() => handleOpenModal("create")}
        >
          New Group
        </CustomButton>
      </Container>
      {modalType === "create" && (
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
    </>
  );
};

export default GroupSection;

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

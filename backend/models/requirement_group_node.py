from services.course_service import CourseService


class RequirementGroupNode:
    """
    A node representing a requirement group in a course prerequisite structure.
    This can either be a leaf node (a list of course IDs) or a parent node with child requirements.
    """

    def __init__(self, course_id, num_required, group_id, parent_group_id, lst):
        """
        Initialize a requirement node.

        Args:
            course_id (str): The course ID this requirement is associated with.
            num_required (int): Number of courses required from this group.
            group_id (str): Unique identifier for this requirement group.
            parent_group_id (str): ID of the parent requirement group.
            lst (list[str] | None): List of course IDs if it's a leaf node; otherwise, None.
        """
        self.course_id = course_id
        self.group_id = group_id
        self.parent_group_id = parent_group_id
        self.num_required = num_required
        self.lst = lst
        self.prerequisites = []

    def __repr__(self):
        return (
            f"<RequirementGroupNode(group_id={self.group_id}, "
            f"num_required={self.num_required})>"
        )

    def requirement_str(self, indent=0):
        """
        Recursively format the requirement tree into a human-readable string.
        
        Args:
            indent (int): Current indentation level for formatting.
        
        Returns:
            str: Formatted string representation of this node and its children.
        """
        indent_str = "  " * indent
        next_indent_str = "  " * (indent + 1)
        item_strs = []

        if self.lst is not None:
            # Leaf node: list of course IDs
            for course_id in self.lst:
                course = CourseService.get_course_by_id(course_id)
                if course:
                    item_strs.append(f"{course_id} {course.course_name}")
                else:
                    item_strs.append(course_id)
        else:
            # Non-leaf node: recurse into prerequisites
            item_strs = [
                prerequisite.requirement_str(indent + 1)
                for prerequisite in self.prerequisites
            ]

        if not item_strs:
            return ""

        if self.num_required == 1:
            joined = f"\n{next_indent_str}OR ".join(item_strs)
            return f"{indent_str}(\n{next_indent_str}{joined}\n{indent_str})"
        elif self.num_required == 0 or self.num_required == len(item_strs):
            joined = f"\n{next_indent_str}AND ".join(item_strs)
            return f"{indent_str}(\n{next_indent_str}{joined}\n{indent_str})"
        else:
            joined = f"\n{next_indent_str}".join(item_strs)
            return f"{indent_str}(Pick {self.num_required} from:\n{next_indent_str}{joined}\n{indent_str})"

    def to_dict(self):
        """
        Convert this node and its children to a dictionary (e.g., for JSON serialization).

        Returns:
            dict: Dictionary representation of the node.
        """
        return {
            "course_id": self.course_id,
            "num_required": self.num_required,
            "group_id": self.group_id,
            "parent_group_id": self.parent_group_id,
            "list": self.lst,
            "prerequisites": [child.to_dict() for child in self.prerequisites],
        }

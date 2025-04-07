from services.course_service import CourseService


class RequirementGroupNode:
    def __init__(self, course_id, num_required, group_id, parent_group_id, lst):
        self.course_id = course_id
        self.group_id = group_id
        self.parent_group_id = parent_group_id
        self.num_required = num_required
        self.lst = lst
        self.prerequisites = []

    def __repr__(self):
        pass

    # def requirement_str(self):
    #     item_strs = []
    #     if self.lst is not None:
    #         for course_id in self.lst:
    #             course = CourseService.get_course_by_id(course_id)
    #             if course:
    #                 item_strs.append(f"{course_id} {course.course_name}")
    #             else:
    #                 item_strs.append(course_id)
    #     else:
    #         item_strs = [
    #             prerequisite.requirement_str() for prerequisite in self.prerequisites
    #         ]

    #     if not item_strs:
    #         return ""

    #     if self.num_required == 1:
    #         return f"({ ' OR '.join(item_strs) })"
    #     elif self.num_required == 0:
    #         return f"({ ' AND '.join(item_strs) })"
    #     else:
    #         return f"(Pick {self.num_required} from: {', '.join(item_strs)})"

    def requirement_str(self, indent=0):
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
        return {
            "course_id": self.course_id,
            "num_required": self.num_required,
            "group_id": self.group_id,
            "parent_group_id": self.parent_group_id,
            "list": self.lst,
            "prerequisites": [child.to_dict() for child in self.prerequisites],
        }

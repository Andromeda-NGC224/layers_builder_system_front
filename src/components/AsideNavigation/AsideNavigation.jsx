import css from "./AsideNavigation.module.css";

const TreeNode = ({ node, nodes, level = 0 }) => {
  const children = nodes.filter((n) => n.parentId === node.id);

  return (
    <div
      className={css.treeNode}
      style={{ marginLeft: `${level * 20}px`, borderLeft: "1px solid #000" }}
    >
      <div className={css.nodeContent}>
        {node.type === "group" || node.type === "resizableGroup" ? "📁" : "📄"}
        {node.data.label}
      </div>
      {children.length > 0 && (
        <div className={css.children}>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              nodes={nodes}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function AsideNavigation({ nodes }) {
  const rootNodes = nodes.filter((node) => !node.parentId);

  return (
    <aside className={css.aside}>
      <div className={css.treeContainer}>
        {rootNodes.map((node) => (
          <TreeNode key={node.id} node={node} nodes={nodes} />
        ))}
      </div>
    </aside>
  );
}

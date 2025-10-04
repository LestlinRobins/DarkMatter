import type { Publication } from "../types";
import { categories } from "../data";

interface ConnectionLinesProps {
  publications: Publication[];
  selectedPub: Publication | null;
  opacity?: number;
}

export function ConnectionLines({
  publications,
  selectedPub,
  opacity = 1,
}: ConnectionLinesProps) {
  if (!selectedPub) return null;

  const color =
    categories[selectedPub.category as keyof typeof categories]?.color ||
    "#888888";

  return (
    <group>
      {selectedPub.connections.map((connId) => {
        const connectedPub = publications.find((p) => p.id === connId);
        if (!connectedPub) return null;

        return (
          <line key={`${selectedPub.id}-${connId}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={
                  new Float32Array([
                    ...selectedPub.position,
                    ...connectedPub.position,
                  ])
                }
                itemSize={3}
                args={[
                  new Float32Array([
                    ...selectedPub.position,
                    ...connectedPub.position,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={color}
              transparent
              opacity={0.6 * opacity}
              linewidth={2}
            />
          </line>
        );
      })}
    </group>
  );
}

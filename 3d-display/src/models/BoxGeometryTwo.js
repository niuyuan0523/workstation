import * as THREE from 'three';

export class BoxGeometryTwo {
    constructor() {
        this.group = new THREE.Group();
        this.createMesh();
    }

    createMesh() {
        // 创建更精细的材质
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x9B59B6,
            transparent: true,
            opacity: 0.85,
            roughness: 0.3,
            metalness: 0.4,
            shininess: 100,
            specular: 0x333333
        });

        // 创建更明显的边缘材质
        const edgeMaterial = new THREE.LineBasicMaterial({ 
            color: 0xffffff,
            linewidth: 3,
            transparent: true,
            opacity: 0.8
        });

        // 创建双斜方柱几何体 - 增大尺寸
        const geometry = new THREE.BoxGeometry(7.5, 3.0, 4.5, 1, 2, 1);
        
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          // 对上下面进行变形，创建双斜方柱效果
          if (positions[i+1] > 1.25 || positions[i+1] < -1.25) {
            positions[i] *= 0.7;     // X方向收缩
            positions[i+2] *= 0.7;   // Z方向收缩
          }
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            edgeMaterial
        );

        this.group.add(mesh);
        this.group.add(edges);
    }

    getMesh() {
        return this.group;
    }
} 
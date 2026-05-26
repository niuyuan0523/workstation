import * as THREE from 'three';

export class BoxGeometryOne {
    constructor() {
        this.group = new THREE.Group();
        this.createMesh();
    }

    createMesh() {
        // 创建更精细的材质
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xE74C3C,
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

        // 创建基础立方体几何体 - 增大尺寸
        const geometry = new THREE.BoxGeometry(3.8, 3.8, 3.8, 8, 8, 8);
        const positions = geometry.attributes.position.array;
        
        // 对立方体进行变形，创建更有趣的形状
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];
            
            // 对边缘顶点进行收缩，创建类似截角立方体的效果
            const threshold = 1.5;
            
            if (Math.abs(x) > threshold && Math.abs(y) > threshold) {
                positions[i] *= 0.7;     // x坐标收缩
                positions[i + 1] *= 0.7; // y坐标收缩
            }
            
            if (Math.abs(y) > threshold && Math.abs(z) > threshold) {
                positions[i + 1] *= 0.7; // y坐标收缩
                positions[i + 2] *= 0.7; // z坐标收缩
            }
            
            if (Math.abs(x) > threshold && Math.abs(z) > threshold) {
                positions[i] *= 0.7;     // x坐标收缩
                positions[i + 2] *= 0.7; // z坐标收缩
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
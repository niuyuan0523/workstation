import * as THREE from 'three';

export class HexagonalBipyramid {
    constructor() {
        this.group = new THREE.Group();
        this.createMesh();
    }

    createMesh() {
        // 创建更精细的材质
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x4A90E2,
            transparent: true,
            opacity: 0.85,
            roughness: 0.3,
            metalness: 0.4,
            shininess: 100,
            specular: 0x222222
        });

        // 创建更明显的边缘材质
        const edgeMaterial = new THREE.LineBasicMaterial({ 
            color: 0xffffff,
            linewidth: 3,
            transparent: true,
            opacity: 0.8
        });

        // 创建六方柱体 - 增大尺寸
        const cylinderGeometry = new THREE.CylinderGeometry(2.0, 2.0, 3.6, 6, 8);
        const cylinder = new THREE.Mesh(cylinderGeometry, material);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        
        // 添加柱体边缘
        const edgesGeometry = new THREE.EdgesGeometry(cylinderGeometry);
        const edges = new THREE.LineSegments(edgesGeometry, edgeMaterial);
        cylinder.add(edges);
        
        // 创建上方的六方锥 - 增大尺寸
        const pyramidGeometryTop = new THREE.ConeGeometry(2.0, 1.5, 6, 4);
        const pyramidTop = new THREE.Mesh(pyramidGeometryTop, material);
        pyramidTop.castShadow = true;
        pyramidTop.receiveShadow = true;
        
        // 添加上锥体边缘
        const edgesGeometryTop = new THREE.EdgesGeometry(pyramidGeometryTop);
        const edgesTop = new THREE.LineSegments(edgesGeometryTop, edgeMaterial);
        pyramidTop.add(edgesTop);
        
        pyramidTop.position.y = 2.55;
        
        // 创建下方的六方锥
        const pyramidGeometryBottom = new THREE.ConeGeometry(2.0, 1.5, 6, 4);
        const pyramidBottom = new THREE.Mesh(pyramidGeometryBottom, material);
        pyramidBottom.castShadow = true;
        pyramidBottom.receiveShadow = true;
        
        // 添加下锥体边缘
        const edgesGeometryBottom = new THREE.EdgesGeometry(pyramidGeometryBottom);
        const edgesBottom = new THREE.LineSegments(edgesGeometryBottom, edgeMaterial);
        pyramidBottom.add(edgesBottom);
        
        pyramidBottom.position.y = -2.55;
        pyramidBottom.rotation.x = Math.PI;

        this.group.add(cylinder);
        this.group.add(pyramidTop);
        this.group.add(pyramidBottom);
    }

    getMesh() {
        return this.group;
    }
} 
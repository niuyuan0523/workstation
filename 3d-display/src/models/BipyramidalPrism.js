import * as THREE from 'three';

export class BipyramidalPrism {
    constructor() {
        this.group = new THREE.Group();
        this.createMesh();
    }

    createMesh() {
        // 创建更精细的材质
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x8B7355,
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

        // 创建四方柱体 - 增大尺寸
        const prismGeometry = new THREE.BoxGeometry(2.0, 3.6, 2.0, 4, 8, 4);
        const prism = new THREE.Mesh(prismGeometry, material);
        prism.castShadow = true;
        prism.receiveShadow = true;
        
        // 添加柱体边缘
        const edgesGeometry = new THREE.EdgesGeometry(prismGeometry);
        const edges = new THREE.LineSegments(edgesGeometry, edgeMaterial);
        prism.add(edges);
        
        // 创建上方的四方锥 - 增大尺寸
        const pyramidGeometryTop = new THREE.ConeGeometry(1.4, 1.2, 4, 4);
        const pyramidTop = new THREE.Mesh(pyramidGeometryTop, material);
        pyramidTop.castShadow = true;
        pyramidTop.receiveShadow = true;
        
        // 添加上锥体边缘
        const edgesGeometryTop = new THREE.EdgesGeometry(pyramidGeometryTop);
        const edgesTop = new THREE.LineSegments(edgesGeometryTop, edgeMaterial);
        pyramidTop.add(edgesTop);
        
        pyramidTop.position.y = 2.4;
        pyramidTop.rotation.y = Math.PI / 4;

        // 创建下方的四方锥
        const pyramidGeometryBottom = new THREE.ConeGeometry(1.4, 1.2, 4, 4);
        const pyramidBottom = new THREE.Mesh(pyramidGeometryBottom, material);
        pyramidBottom.castShadow = true;
        pyramidBottom.receiveShadow = true;
        
        // 添加下锥体边缘
        const edgesGeometryBottom = new THREE.EdgesGeometry(pyramidGeometryBottom);
        const edgesBottom = new THREE.LineSegments(edgesGeometryBottom, edgeMaterial);
        pyramidBottom.add(edgesBottom);
        
        pyramidBottom.position.y = -2.4;
        pyramidBottom.rotation.x = Math.PI;
        pyramidBottom.rotation.y = Math.PI / 4;

        this.group.add(prism);
        this.group.add(pyramidTop);
        this.group.add(pyramidBottom);
    }

    getMesh() {
        return this.group;
    }
} 